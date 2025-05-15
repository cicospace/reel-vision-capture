
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Use the Supabase session as the source of truth
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth check error:", error);
        setAuthenticated(false);
      } else {
        setAuthenticated(!!data.session);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Also set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!authenticated) {
    // Store the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
