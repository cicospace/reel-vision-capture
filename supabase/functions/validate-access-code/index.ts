
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// The secure access code - must match the one in the frontend
const SECURE_ACCESS_CODE = "KJ7p#xF2@qT9!LzN5vR8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessCode } = await req.json();
    
    // Validate the access code
    if (accessCode !== SECURE_ACCESS_CODE) {
      return new Response(
        JSON.stringify({ error: "Invalid access code" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Code is valid, create a Supabase client with service role to generate a custom token
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Create a custom token for the admin@cicospace.com user
    // This approach uses createUser if the user doesn't exist yet, or just returns the user if they do
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@cicospace.com',
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });
    
    if (userError && userError.message !== "User already registered") {
      throw userError;
    }
    
    // Generate a JWT token for the user
    const { data: { session }, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: 'admin@cicospace.com',
    });
    
    if (error) {
      throw error;
    }
    
    // Return the token
    return new Response(
      JSON.stringify({ 
        token: session.access_token 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
