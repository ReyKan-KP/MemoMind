import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return { isLoading, isAuthenticated, user };
};

export const useRequireAuth = (redirectTo = "/login") => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push(redirectTo);
          return;
        }
        
        // Update last_active timestamp
        await supabase
          .from("users")
          .update({ last_active: new Date().toISOString() })
          .eq("id", session.user.id);
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        router.push(redirectTo);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, supabase, redirectTo]);

  return { isLoading, isAuthenticated };
};