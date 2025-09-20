
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL, validateAccessCode } from "@/utils/authUtils";
import SimpleOtp from "@/components/ui/SimpleOtp";

export default function LoginForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const generateSecurePassword = (accessCode: string): string => {
    // Create a more secure password with mix of numbers and letters
    const base = accessCode;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'admin_';
    
    // Generate deterministic but complex password based on access code
    for (let i = 0; i < accessCode.length; i++) {
      const num = parseInt(accessCode[i]);
      result += chars[num * 6 + i]; // Mix position and digit for variety
      result += chars[(num + i) * 4 % chars.length]; // Add second char
    }
    
    result += '_secure2024';
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccessCode(code)) {
      return toast.error("Invalid code");
    }
    setLoading(true);
    const password = generateSecurePassword(code);

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });

      if (error?.message.includes("Invalid login credentials")) {
        // auto-signup flow
        const { error: deleteError } = await supabase.functions.invoke(
          "delete-user-by-email",
          {
            body: { email: ADMIN_EMAIL }
          }
        );
        
        if (deleteError) {
          console.log("Could not delete user:", deleteError.message);
        }
        
        const { data: suData, error: suErr } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password,
          options: { data: { confirmed_at: new Date().toISOString() } },
        });
        if (suErr) throw suErr;
        data = suData.session
          ? suData
          : (await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })).data;
      }

      if (!data?.session) throw new Error("Authentication failed");
      
      // Critical: Ensure the session actually got written to storage before navigation
      await supabase.auth.getSession();

      toast.success("Welcome back!");
      
      // Get the redirect path from location state or default to "/admin"
      const from = (location.state as any)?.from || "/admin";
      
      console.log("LoginForm: Authentication successful, redirecting to:", from);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.error("Access denied", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 p-6">
      <h2 className="text-xl font-semibold text-center">Admin Access</h2>
      <div className="flex justify-center mb-4">
        <SimpleOtp 
          value={code} 
          onChange={setCode} 
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying…" : "Enter Dashboard"}
      </Button>
    </form>
  );
}
