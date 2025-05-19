
import { supabase } from "@/integrations/supabase/client";

/**
 * Forces a refresh of the PostgREST schema cache
 * This can resolve issues where recently added columns are not recognized
 */
export const refreshSchemaCache = async () => {
  try {
    console.log('Attempting to refresh PostgREST schema cache...');
    
    // Send a notification to the pgrst channel to reload the schema
    const { error } = await supabase.rpc('pg_notify', { 
      channel: 'pgrst',
      payload: 'reload schema'
    });
    
    if (error) {
      console.error('Error refreshing schema cache:', error);
      return false;
    }
    
    console.log('Schema cache refresh request sent successfully');
    return true;
  } catch (err) {
    console.error('Exception when refreshing schema cache:', err);
    return false;
  }
};
