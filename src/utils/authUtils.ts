
export const ADMIN_EMAIL = 'admin@example.com';

export function validateAccessCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function setAuthenticatedState(): void {
  localStorage.setItem('isAdmin', 'true');
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('isAdmin') === 'true';
}
