
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Auth = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const from = location.state?.from || "/admin";
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkExistingAuth();
  }, [navigate, location.state]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 border-gray-800 bg-card text-card-foreground">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/a2a809e3-8770-41b2-bd3e-c4dc102d1aa9.png" 
            alt="Cicospace Logo" 
            className="h-16"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Admin Access</h1>
        <LoginForm />
      </Card>
    </div>
  );
};

export default Auth;
