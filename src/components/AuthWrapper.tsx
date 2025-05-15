
import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          setAuthenticated(true);
        } else {
          navigate("/auth");
          toast.error("Please enter access code to view this page");
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        
        // Special handling for email not confirmed error
        if (error.message && error.message.includes("Email not confirmed")) {
          toast.error("Email not confirmed", {
            description: "Your account needs verification. Please try logging in again.",
          });
        }
        
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setAuthenticated(true);
        } else if (event === "SIGNED_OUT") {
          setAuthenticated(false);
          navigate("/auth");
        } else if (event === "USER_UPDATED") {
          // Handle user update events if needed
          console.log("User updated event received");
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
