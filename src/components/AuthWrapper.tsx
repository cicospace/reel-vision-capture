import { useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First set up the auth listener to avoid race conditions
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state change:", event);
            if (event === "SIGNED_IN" && session) {
              setAuthenticated(true);
            } else if (event === "SIGNED_OUT") {
              setAuthenticated(false);
              if (location.pathname !== "/auth") {
                navigate("/auth");
              }
            }
          }
        );
        
        // Then check for an existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          setAuthenticated(true);
        } else {
          if (location.pathname !== "/auth") {
            navigate("/auth");
            toast.error("Please enter access code to view this page");
          }
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        
        // Special handling for email not confirmed error
        if (error.message && error.message.includes("Email not confirmed")) {
          toast.error("Email not confirmed", {
            description: "Your account needs verification. Please try logging in again.",
          });
        }
        
        if (location.pathname !== "/auth") {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      // The subscription cleanup is handled inside the checkAuth function
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    // If we're on the auth page and not authenticated, render the auth page
    if (location.pathname === "/auth") {
      return <>{children}</>;
    }
    // Otherwise, return null so the router can redirect
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
