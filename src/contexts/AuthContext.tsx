import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import {
  getCurrentUser,
  getSession,
  signOut,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  resetPassword as supabaseResetPassword,
  supabase,
} from "@/lib/supabaseClient";

type UserRole = "guest" | "user" | "admin";

type AuthUser = {
  id: string;
  email: string | null;
  name?: string;
  phone?: string;
  role: UserRole;
  isGuest: boolean;
};

type AuthContextType = {
  user: User | null;
  authUser: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ data: any; error: any }>;
  signUp: (
    email: string,
    password: string,
    role?: "user" | "admin",
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updateUserProfile: (profile: {
    name?: string;
    phone?: string;
  }) => Promise<{ error: any }>;
  hasPermission: (requiredRole: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role and details from database
  const fetchUserDetails = async (currentUser: User) => {
    try {
      // First check if user exists in auth_users (regular or admin)
      const { data: authUserData, error: authUserError } = await supabase
        .from("auth_users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (authUserData) {
        setAuthUser({
          id: currentUser.id,
          email: currentUser.email,
          role: authUserData.role,
          isGuest: false,
        });
        return;
      }

      // If not found in auth_users, check guest_users
      const { data: guestUserData, error: guestUserError } = await supabase
        .from("guest_users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (guestUserData) {
        setAuthUser({
          id: currentUser.id,
          email: null,
          name: guestUserData.name,
          phone: guestUserData.phone,
          role: guestUserData.role || "guest",
          isGuest: true,
        });
        return;
      }

      // If user not found in either table, set as default user
      setAuthUser({
        id: currentUser.id,
        email: currentUser.email,
        role: "user",
        isGuest: false,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);

        // Get current session
        const { session: currentSession } = await getSession();
        setSession(currentSession);

        // Get user data if session exists
        if (currentSession) {
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);

          if (currentUser) {
            await fetchUserDetails(currentUser);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);

        if (event === "SIGNED_IN" && currentSession) {
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);

          if (currentUser) {
            await fetchUserDetails(currentUser);
          }
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setAuthUser(null);
          setSession(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check if user has required role or higher
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!authUser) return false;

    const roleHierarchy: Record<UserRole, number> = {
      guest: 1,
      user: 2,
      admin: 3,
    };

    return roleHierarchy[authUser.role] >= roleHierarchy[requiredRole];
  };

  // Update user profile
  const updateUserProfile = async (profile: {
    name?: string;
    phone?: string;
  }) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      // Update user metadata in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: profile,
      });

      if (updateError) {
        return { error: updateError };
      }

      // If the user is in auth_users table, update there too
      if (authUser && !authUser.isGuest) {
        const { error: dbError } = await supabase
          .from("auth_users")
          .update(profile)
          .eq("id", user.id);

        if (dbError) {
          return { error: dbError };
        }
      }

      // If the user is a guest user, update in guest_users table
      if (authUser && authUser.isGuest) {
        const { error: dbError } = await supabase
          .from("guest_users")
          .update(profile)
          .eq("id", user.id);

        if (dbError) {
          return { error: dbError };
        }
      }

      // Update local state
      setAuthUser((prev) => (prev ? { ...prev, ...profile } : null));

      return { error: null };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { error };
    }
  };

  const value = {
    user,
    authUser,
    session,
    isLoading,
    hasPermission,
    signIn: supabaseSignIn,
    signUp: supabaseSignUp,
    resetPassword: supabaseResetPassword,
    updateUserProfile,
    signOut: async () => {
      const result = await signOut();
      if (!result.error) {
        setUser(null);
        setAuthUser(null);
        setSession(null);
      }
      return result;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
