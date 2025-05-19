
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute: Checking auth state for path:", location.pathname);
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, authSession) => {
      console.log("ProtectedRoute: Auth state change event:", event);
      setSession(authSession);
    });
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      console.log('ProtectedRoute session check result:', data.session ? 'Session exists' : 'No session');
      setSession(data.session);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Effect for redirecting if no session after loading completes
  useEffect(() => {
    if (!loading && !session) {
      console.log('No session → redirect to /auth from', location.pathname + location.search);
      navigate('/auth', { 
        state: { from: location.pathname + location.search }, 
        replace: true 
      });
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
