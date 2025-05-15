
import { useEffect, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { setAuthenticatedState, clearAuthenticatedState } from "@/utils/authUtils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { logAuthState } from "@/utils/loggingUtils";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthWrapper: Initializing for path:", location.pathname);
    console.log("AuthWrapper: Location state:", JSON.stringify(location.state));

    // First check if there's an existing session directly
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthWrapper session check error:", error);
        }
        
        // Update authenticated state based on session
        if (data.session) {
          console.log("AuthWrapper: Found existing session");
          setAuthenticated(true);
          setAuthenticatedState(); // Update local storage as well
          
          // If on auth page, redirect to intended destination
          if (location.pathname === "/auth" && location.state?.from) {
            const redirectPath = location.state.from;
            console.log("AuthWrapper: Redirecting to:", redirectPath);
            navigate(redirectPath, { replace: true });
          }
        } else {
          console.log("AuthWrapper: No session found");
          setAuthenticated(false);
          clearAuthenticatedState();
          
          // Only redirect if not already on auth page
          if (location.pathname !== "/auth" && !location.pathname.startsWith("/")) {
            console.log("AuthWrapper: Redirecting to auth page from:", location.pathname);
            navigate("/auth", { 
              state: { from: location.pathname }, 
              replace: true 
            });
          }
        }
        
        // Log detailed auth state for debugging
        await logAuthState();
      } catch (err) {
        console.error("AuthWrapper unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Then set up auth listener for future changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthWrapper: Auth state change:", event);
      
      if (event === "SIGNED_IN" && session) {
        setAuthenticated(true);
        setAuthenticatedState();
        
        // If on auth page, redirect to intended destination
        if (location.pathname === "/auth") {
          // Extract the target path from location state or default to /admin
          const redirectPath = location.state?.from || "/admin";
          console.log("AuthWrapper: SIGNED_IN - Redirecting to:", redirectPath);
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 0);
        }
      } 
      else if (event === "SIGNED_OUT") {
        setAuthenticated(false);
        clearAuthenticatedState();
        
        // If not on auth page, redirect to auth
        if (location.pathname !== "/auth" && !location.pathname.startsWith("/")) {
          console.log("AuthWrapper: SIGNED_OUT - Redirecting to auth from:", location.pathname);
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
  }, [navigate, location.pathname, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // For the auth page specifically, show it regardless of auth status
  if (location.pathname === "/auth") {
    return <>{children}</>;
  }

  // For other protected pages, only show if authenticated
  if (!authenticated) {
    console.log("AuthWrapper: Not authenticated for protected content, waiting for router redirect");
    return null; // Return null so the router can handle the redirection
  }

  console.log("AuthWrapper: User is authenticated, rendering content for:", location.pathname);
  return <>{children}</>;
};

export default AuthWrapper;
