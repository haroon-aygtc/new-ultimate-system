import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { getCurrentUser, getSession, signOut } from "@/lib/supabaseClient";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  const value = {
    user,
    session,
    isLoading,
    signOut: async () => {
      const result = await signOut();
      if (!result.error) {
        setUser(null);
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
