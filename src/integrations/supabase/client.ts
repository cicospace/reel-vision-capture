
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// Using hardcoded values since Lovable doesn't use VITE env variables
const SUPABASE_URL = "https://hxcceigrkxcaxsiikuvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4Y2NlaWdya3hjYXhzaWlrdXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjcxNzcsImV4cCI6MjA2MjY0MzE3N30.UBLIXXjHIoOMS0p6-Wyd0wvAAlNKFaAt-vMuiuVdm3Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, 
    autoRefreshToken: true
  }
});
