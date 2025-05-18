
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SimpleOtp from "@/components/ui/SimpleOtp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import {
  validateAccessCode,
  ADMIN_EMAIL,
  setAuthenticatedState,
} from "@/utils/authUtils";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [accessCode, setAccessCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateAccessCode(accessCode)) {
        throw new Error("Invalid access code");
      }

      const password = `${accessCode}_supabase`;

      let { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });

      if (
        error &&
        (error.message.includes("Email not confirmed") ||
          error.message.includes("Invalid login credentials"))
      ) {
        // Attempt signup + auto-confirm
        {
          const { error: deleteError } = await supabase.rpc(
            'delete_user_by_email',
            { email_to_delete: ADMIN_EMAIL }
          );
          if (deleteError) {
            console.log("Could not delete existing user:", deleteError.message);
          }
        }

        const { data: suData, error: suError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password,
          options: { data: { confirmed_at: new Date().toISOString() } },
        });
        if (suError) throw suError;

        if (!suData.session) {
          await new Promise((r) => setTimeout(r, 1000));
          const { data: siData, error: siError } =
            await supabase.auth.signInWithPassword({
              email: ADMIN_EMAIL,
              password,
            });
          if (siError) throw siError;
          data = siData;
        } else {
          data = suData;
        }
      } else if (error) {
        throw error;
      }

      setAuthenticatedState();
      toast.success("Access granted");

      onLoginSuccess?.();

      const redirectTo = (location.state as { from?: string })?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      toast.error("Access denied", {
        description: err.message || "Please check your access code",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <KeyRound className="mx-auto mb-4 h-8 w-8 text-primary" />
        <p className="text-muted-foreground">
          Enter the secure access code to continue
        </p>
      </div>

      <div className="flex justify-center">
        <SimpleOtp value={accessCode} onChange={setAccessCode} />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground"
        disabled={loading}
      >
        {loading ? "Verifying…" : "Access Admin Dashboard"}
      </Button>
    </form>
  );
}
