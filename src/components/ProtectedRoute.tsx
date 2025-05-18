
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("ProtectedRoute: Checking auth state for path:", location.pathname);
      
      try {
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("ProtectedRoute: Auth state change event:", event);
            const isAuthed = !!session;
            setAuthenticated(isAuthed);
            setAuthChecked(true);
          }
        );
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("ProtectedRoute auth error:", error);
          setAuthenticated(false);
          setAuthChecked(true);
        } else {
          const isAuthed = !!data.session;
          console.log("ProtectedRoute: Session check result:", isAuthed ? "authenticated" : "not authenticated");
          setAuthenticated(isAuthed);
          setAuthChecked(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("ProtectedRoute unexpected error:", error);
        setAuthenticated(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /auth with state:", { from: location.pathname + location.search });
    // Store the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  console.log("ProtectedRoute: User is authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
