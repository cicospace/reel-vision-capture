
import { supabase } from "@/integrations/supabase/client";

// Log authentication state
export const logAuthState = async () => {
  // Add explicit authentication state logging
  const { data: authData } = await supabase.auth.getSession();
  console.log('Auth session check:', {
    hasSession: !!authData.session,
    isExpired: authData.session ? new Date(authData.session.expires_at * 1000) < new Date() : 'N/A',
    role: authData.session ? 'authenticated' : 'anon',
    userId: authData.session?.user?.id || 'none',
    expiresAt: authData.session?.expires_at ? new Date(authData.session.expires_at * 1000).toISOString() : 'N/A'
  });
  
  // Log local storage state
  try {
    const localAuth = localStorage.getItem("cicospace_auth");
    console.log('Local storage auth state:', localAuth ? JSON.parse(localAuth) : 'not set');
  } catch (e) {
    console.error('Error reading local storage:', e);
  }
  
  // Log request headers (from auth context)
  console.log('Supabase client configuration:', {
    persistSession: true,
    autoRefreshToken: true
  });
};

// Log Supabase connection information
export const logSupabaseConnection = () => {
  console.log('Supabase connection check:', {
    hasSupabase: !!supabase,
    hasInsertMethod: !!(supabase && supabase.from),
    url: supabase.supabaseUrl
  });
};

// Log navigation events
export const logNavigation = (from: string, to: string, params?: Record<string, any>) => {
  console.log(`Navigation: ${from} → ${to}`, params || {});
};
