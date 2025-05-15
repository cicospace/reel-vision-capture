
import { supabase } from "@/integrations/supabase/client";

// Log authentication state
export const logAuthState = async () => {
  // Add explicit authentication state logging
  const { data: authData } = await supabase.auth.getSession();
  console.log('Auth session check:', {
    hasSession: !!authData.session,
    isExpired: authData.session ? new Date(authData.session.expires_at * 1000) < new Date() : 'N/A',
    role: authData.session ? 'authenticated' : 'anon'
  });
  
  // Log request headers (from auth context)
  console.log('Supabase client configuration:', {
    persistSession: false,
    autoRefreshToken: false,
    usingAnonymousAuth: true
  });
};

// Log Supabase connection information
export const logSupabaseConnection = () => {
  console.log('Supabase connection check:', {
    hasSupabase: !!supabase,
    hasInsertMethod: !!(supabase && supabase.from)
  });
};
