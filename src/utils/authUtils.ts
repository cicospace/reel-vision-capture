
/**
 * Authentication utilities for Cicospace
 */
import { supabase } from "@/integrations/supabase/client";

// Simple hash function for basic code validation
export const simpleHash = (code: string): string => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// The secure access code - in a real application, this would be stored securely
export const SECURE_ACCESS_CODE = "KJ7p#xF2@qT9!LzN5vR8";
export const HASHED_ACCESS_CODE = simpleHash(SECURE_ACCESS_CODE);

// Email used for authentication - using a format that Supabase will accept
export const ADMIN_EMAIL = "cicospace.demo+admin@gmail.com";

// Check if the user is authenticated based on localStorage and session
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // First check localStorage as a fast path
    const localAuth = localStorage.getItem("cicospace_auth");
    
    if (localAuth) {
      const auth = JSON.parse(localAuth);
      if (auth.authenticated && new Date(auth.expiry) > new Date()) {
        // Local storage says user is authenticated and not expired
        // Double-check with Supabase as the source of truth
        const { data } = await supabase.auth.getSession();
        if (data.session !== null) {
          return true;
        }
      }
    }
    
    // If localStorage check failed, verify with Supabase session as the source of truth
    const { data } = await supabase.auth.getSession();
    return data.session !== null;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

// Store authentication state in localStorage with expiry
export const setAuthenticatedState = (): void => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
  
  const authState = {
    authenticated: true,
    expiry: expiryDate.toISOString()
  };
  
  localStorage.setItem("cicospace_auth", JSON.stringify(authState));
};

// Clear authentication state
export const clearAuthenticatedState = (): void => {
  localStorage.removeItem("cicospace_auth");
};

// Validate access code
export const validateAccessCode = (code: string): boolean => {
  // Try direct match first (most secure)
  if (code === SECURE_ACCESS_CODE) {
    return true;
  }
  
  // Fallback to hash comparison
  return simpleHash(code) === HASHED_ACCESS_CODE;
};

// Function to delete a user by email through the edge function
export const deleteUserByEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user-by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }
    
    return { success: true, message: data.message };
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    return { success: false, message: error.message };
  }
};
