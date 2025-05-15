
import { useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { setAuthenticatedState, clearAuthenticatedState } from "@/utils/authUtils";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First check if there's an existing session directly
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Session check error:", error);
      }
      
      // Update authenticated state based on session
      if (data.session) {
        setAuthenticated(true);
        setAuthenticatedState(); // Update local storage as well
      } else {
        setAuthenticated(false);
        clearAuthenticatedState();
        
        // Only redirect if not already on auth page
        if (location.pathname !== "/auth") {
          navigate("/auth", { 
            state: { from: location.pathname }, 
            replace: true 
          });
        }
      }
      
      setLoading(false);
    });
    
    // Then set up auth listener for future changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      
      if (event === "SIGNED_IN" && session) {
        setAuthenticated(true);
        setAuthenticatedState();
        
        // If on auth page, redirect to intended destination
        if (location.pathname === "/auth") {
          const redirectTo = location.state?.from || "/admin";
          navigate(redirectTo, { replace: true });
        }
      } 
      else if (event === "SIGNED_OUT") {
        setAuthenticated(false);
        clearAuthenticatedState();
        
        // If not on auth page, redirect to auth
        if (location.pathname !== "/auth") {
          navigate("/auth", { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      }
    });
    
    // Clean up listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For the auth page specifically, show it regardless of auth status
  if (location.pathname === "/auth") {
    return <>{children}</>;
  }

  // For other protected pages, only show if authenticated
  if (!authenticated) {
    return null; // Return null so the router can handle the redirection
  }

  return <>{children}</>;
};

export default AuthWrapper;
