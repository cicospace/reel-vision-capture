
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL, validateAccessCode, setAuthenticatedState } from "@/utils/authUtils";

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
        // Properly type the RPC parameter
        const params: { email_to_delete: string } = { email_to_delete: ADMIN_EMAIL };
        await supabase.rpc("delete_user_by_email", params);
        
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
      const dest = (location.state as any)?.from || "/admin";
      navigate(dest, { replace: true });
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
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter access code"
        className="w-full border rounded px-3 py-2"
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying…" : "Enter Dashboard"}
      </Button>
    </form>
  );
}
