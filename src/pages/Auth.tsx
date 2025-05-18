
import React, { useState } from 'react';
import SimpleOtp from '@/components/ui/SimpleOtp';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ADMIN_EMAIL, validateAccessCode, setAuthenticatedState } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';

export default function Auth() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, if provided
  const redirectTo = (location.state as { from?: string })?.from || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccessCode(code)) {
      toast.error('Invalid access code', {
        description: 'Please enter a valid 6-digit code'
      });
      return;
    }
    
    try {
      setLoading(true);
      const password = `${code}_supabase`;
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: ADMIN_EMAIL, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      setAuthenticatedState();
      toast.success('Logged in successfully');
      navigate(redirectTo);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md border">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/a2a809e3-8770-41b2-bd3e-c4dc102d1aa9.png" 
            alt="Cicospace Logo" 
            className="h-12 mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter your access code to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Access Code</label>
            <div className="flex justify-center">
              <SimpleOtp value={code} onChange={setCode} />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Access Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
