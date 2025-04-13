import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

type SupabaseContextType = {
  isConnected: boolean;
  connectionError: string | null;
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined,
);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check connection to Supabase
    async function checkConnection() {
      try {
        // Simple query to check if we can connect to Supabase
        const { error } = await supabase
          .from("system_settings")
          .select("id")
          .limit(1);

        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionError(`Failed to connect to Supabase: ${error.message}`);
          setIsConnected(false);
        } else {
          setConnectionError(null);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Supabase connection check failed:", err);
        setConnectionError(
          `Failed to connect to Supabase: ${err instanceof Error ? err.message : String(err)}`,
        );
        setIsConnected(false);
      }
    }

    checkConnection();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ isConnected, connectionError, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
