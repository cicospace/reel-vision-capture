import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { validateAccessCode, ADMIN_EMAIL, setAuthenticatedState } from "@/utils/authUtils";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [accessCode, setAccessCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First, validate the access code on the client side
      if (!validateAccessCode(accessCode)) {
        throw new Error("Invalid access code");
      }
      
      // Create password using the access code
      const password = `${accessCode}_supabase`;
      
      // Try to sign in first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      });
      
      // If email not confirmed error or the user doesn't exist yet, sign up and auto-confirm
      if (error && (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials"))) {
        console.log("Attempting to sign up user since login failed with:", error.message);
        
        // First try to delete any existing user that might be unconfirmed
        try {
          // This requires admin privileges, but we'll try anyway in case we're in dev mode
          const { error: deleteError } = await supabase.rpc('delete_user_by_email', { 
            email_to_delete: ADMIN_EMAIL 
          });
          
          if (deleteError) {
            console.log("Could not delete existing user:", deleteError.message);
          }
        } catch (deleteError) {
          console.log("Error when trying to delete user:", deleteError);
        }
        
        // Then sign up a new user with auto-confirmation
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: password,
          options: {
            // This attempts to auto-confirm the email
            data: {
              confirmed_at: new Date().toISOString(),
            }
          }
        });
        
        if (signUpError) {
          throw signUpError;
        }

        if (!signUpData.session) {
          // If we don't have a session after signup, we'll need to sign in
          // But first let's wait a moment for the signup to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try signing in again
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: password,
          });
          
          if (signInError) {
            throw new Error("Auto-confirmation failed. Please contact support or manually confirm the email in Supabase dashboard.");
          }
          
          data = signInData;
        } else {
          data = signUpData;
        }
      } else if (error) {
        throw error;
      }
      
      // Store authentication state in localStorage
      setAuthenticatedState();
      
      toast.success("Access granted");

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Check if we have a redirect path from location state
      const redirectTo = location.state?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast.error("Access denied", {
        description: error.message || "Please check your access code and try again"
      });
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <p className="text-center text-muted-foreground mb-4">
          Enter the secure access code to continue
        </p>
        <div className="flex justify-center mb-4">
          <InputOTP 
            value={accessCode} 
            onChange={setAccessCode} 
            length={6}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          <span className="flex items-center">
            Access Admin Dashboard
          </span>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
