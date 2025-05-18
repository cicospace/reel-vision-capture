
export const ADMIN_EMAIL = 'admin@example.com';

export function validateAccessCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

// NOTE: These functions are kept for compatibility with existing code
// But authentication is now primarily managed by Supabase sessions
export function setAuthenticatedState(): void {
  // This is no longer the primary auth mechanism
  // Left for backward compatibility
  localStorage.setItem('isAdmin', 'true');
}

export function clearAuthenticatedState(): void {
  localStorage.removeItem('isAdmin');
}

export function isAuthenticated(): boolean {
  // This function is now primarily used as a fallback
  // The main authentication check should use Supabase auth state
  return localStorage.getItem('isAdmin') === 'true';
}
