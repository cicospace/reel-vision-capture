
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

// The secure access code - in a real application, this would be stored securely
const SECURE_ACCESS_CODE = "KJ7p#xF2@qT9!LzN5vR8";

const Auth = () => {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate the access code
      if (accessCode === SECURE_ACCESS_CODE) {
        // Sign in with a shared admin account
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@cicospace.com',
          password: 'KJ7p#xF2@qT9!LzN5vR8' // Using the same access code as password
        });
        
        if (error) throw error;
        
        toast.success("Access granted");
        navigate("/admin");
      } else {
        throw new Error("Invalid access code");
      }
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
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Enter the secure access code to continue
            </p>
            <div className="flex justify-center mb-4">
              <div className="max-w-[320px] overflow-hidden">
                <InputOTP
                  maxLength={20}
                  value={accessCode}
                  onChange={setAccessCode}
                  pattern="^[A-Za-z0-9!@#$%^&*()_+-=[\]{}|;:,.<>/?]*$"
                  inputMode="text"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                    <InputOTPSlot index={8} />
                    <InputOTPSlot index={9} />
                    <InputOTPSlot index={10} />
                    <InputOTPSlot index={11} />
                    <InputOTPSlot index={12} />
                    <InputOTPSlot index={13} />
                    <InputOTPSlot index={14} />
                    <InputOTPSlot index={15} />
                    <InputOTPSlot index={16} />
                    <InputOTPSlot index={17} />
                    <InputOTPSlot index={18} />
                    <InputOTPSlot index={19} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
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
      </Card>
    </div>
  );
};

export default Auth;
