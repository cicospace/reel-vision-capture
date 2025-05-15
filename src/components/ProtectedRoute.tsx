
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { logAuthState } from "@/utils/loggingUtils";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("ProtectedRoute: Checking auth state for path:", location.pathname);
      
      try {
        // First check with Supabase as the source of truth
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("ProtectedRoute auth error:", error);
          setAuthenticated(false);
        } else {
          const isAuthed = !!data.session;
          console.log("ProtectedRoute: Session check result:", isAuthed ? "authenticated" : "not authenticated");
          setAuthenticated(isAuthed);
        }

        // Log detailed auth state for debugging
        await logAuthState();
      } catch (error) {
        console.error("ProtectedRoute unexpected error:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("ProtectedRoute: Auth state change event:", event);
      setAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /auth with state:", { from: location.pathname });
    // Store the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  console.log("ProtectedRoute: User is authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
