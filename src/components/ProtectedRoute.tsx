
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<any>(undefined);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("ProtectedRoute: Checking auth state for path:", location.pathname);
      
      try {
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("ProtectedRoute: Auth state change event:", event);
            setSession(session);
          }
        );
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("ProtectedRoute auth error:", error);
          setSession(null);
        } else {
          console.log("ProtectedRoute: Session check result:", data.session ? "authenticated" : "not authenticated");
          setSession(data.session);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("ProtectedRoute unexpected error:", error);
        setSession(null);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Still checking with Supabase
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // No session → send to auth, preserving where we were
  if (!session) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /auth with state:", { from: location.pathname + location.search });
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  console.log("ProtectedRoute: User is authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
