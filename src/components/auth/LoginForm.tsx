
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL, validateAccessCode, setAuthenticatedState } from "@/utils/authUtils";
import SimpleOtp from "@/components/ui/SimpleOtp";

export default function LoginForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccessCode(code)) {
      return toast.error("Invalid code");
    }
    setLoading(true);
    const password = `${code}_supabase`;

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });

      if (error?.message.includes("Invalid login credentials")) {
        // auto-signup flow
        // Using a type assertion to specify the delete_user_by_email parameter
        const { error: deleteError } = await supabase.rpc(
          "delete_user_by_email", 
          { email_to_delete: ADMIN_EMAIL } as { email_to_delete: string }
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

      setAuthenticatedState();
      toast.success("Welcome back!");
      
      // Fix the location state type handling
      const from = location.state && typeof location.state === 'object' && 'from' in location.state 
        ? location.state.from as string 
        : "/admin";
        
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
