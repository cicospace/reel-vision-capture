
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<any>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      supabase.auth.getSession().then(({ data }) => {
        console.log('ProtectedRoute session:', data.session);
        setSession(data.session);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("ProtectedRoute unexpected error:", error);
      setSession(null);
      setLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !session) {
      console.log('No session → redirect to /auth from', location.pathname);
      navigate('/auth', { state: { from: location.pathname + location.search }, replace: true });
    }
  }, [loading, session, navigate, location]);

  // Still checking with Supabase
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  console.log("ProtectedRoute: User is authenticated, rendering protected content");
  return session ? <>{children}</> : null;
};

export default ProtectedRoute;
