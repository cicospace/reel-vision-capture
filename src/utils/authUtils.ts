
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = 'admin@example.com';
export const SECURE_ACCESS_CODE = '739281';

export function validateAccessCode(code: string): boolean {
  return code === SECURE_ACCESS_CODE;
}

// These functions are now primarily used for backward compatibility
// The main authentication is managed by Supabase sessions
export function setAuthenticatedState(): void {
  localStorage.setItem('isAdmin', 'true');
}

export function clearAuthenticatedState(): void {
  localStorage.removeItem('isAdmin');
  // Also sign out from Supabase to ensure consistency
  supabase.auth.signOut().catch(error => {
    console.error("Error during sign out:", error);
  });
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data } = await supabase.auth.getSession();
    console.log("isAuthenticated check:", !!data.session);
    // If we have a session, the user is authenticated
    return !!data.session;
  } catch (error) {
    console.error("Error checking authentication:", error);
    // Fall back to localStorage if Supabase auth check fails
    return localStorage.getItem('isAdmin') === 'true';
  }
}
