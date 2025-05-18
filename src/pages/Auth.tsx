
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleOtp from "@/components/ui/SimpleOtp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateAccessCode, setAuthenticatedState } from "@/utils/authUtils";
import { toast } from "sonner";

const Auth = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccessCode(accessCode)) {
      toast.error("Please enter a valid 6-digit access code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you'd verify this code with your backend
      // Here we're just simulating a successful login
      setAuthenticatedState();
      toast.success("Access granted!");
      navigate("/admin");
    } catch (error) {
      toast.error("Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                Enter 6-digit access code
              </label>
              <div className="flex justify-center">
                <SimpleOtp value={accessCode} onChange={setAccessCode} />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={accessCode.length !== 6 || isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Access Admin Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
