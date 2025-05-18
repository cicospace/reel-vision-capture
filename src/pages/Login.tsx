
import React, { useState } from 'react';
import SimpleOtp from '@/components/ui/SimpleOtp';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ADMIN_EMAIL,
  validateAccessCode,
  setAuthenticatedState
} from '@/utils/authUtils';

export default function Login() {
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccessCode(accessCode)) {
      toast.error('Invalid access code');
      return;
    }
    const password = `${accessCode}_supabase`;
    // signIn logic...
    setAuthenticatedState();
    navigate('/admin');
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
      <SimpleOtp value={accessCode} onChange={setAccessCode} />
      <button type="submit">Access Admin Dashboard</button>
    </form>
  );
}
