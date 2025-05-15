
import { supabase } from "@/integrations/supabase/client";
import { SubmissionResponse } from "../types";

// Helper function to handle reel examples insertion
export async function handleReelExamples(reelExamples: any[], submissionId: string): Promise<SubmissionResponse> {
  console.log('Inserting reel examples:', reelExamples.length);
  
  const reelExamplesToInsert = reelExamples.map((example: any) => ({
    submission_id: submissionId,
    link: example.link || '',
    comment: example.comment || ''
  }));
  
  console.log('Reel examples to insert:', reelExamplesToInsert);
  
  // Get session information directly before reel examples submission
  const { data: sessionData } = await supabase.auth.getSession();
  console.log('Auth session before reel examples insert:', {
    hasSession: !!sessionData.session,
    role: sessionData.session ? 'authenticated' : 'anon'
  });
  
  const { data: reelData, error: reelExamplesError } = await supabase
    .from('reel_examples')
    .insert(reelExamplesToInsert);
  
  console.log('Reel examples insert result:', reelData || 'No data returned');
  
  if (reelExamplesError) {
    console.error('Reel examples error:', reelExamplesError);
    console.error('Error message:', reelExamplesError.message);
    console.error('Error code:', reelExamplesError.code);
    console.error('Error details:', reelExamplesError.details);
    
    // Check for RLS violation in reel_examples table too
    if (reelExamplesError.code === '42501') {
      console.error('RLS VIOLATION: Row Level Security policy issue on reel_examples table');
      console.error('Check that the anon role has INSERT permission on reel_examples table');
      console.error('Check that an appropriate RLS policy exists for anonymous inserts');
    }
    
    // We'll continue even if reel examples fail, since the main submission was successful
    // but we'll return information about the error
    return { 
      success: true, 
      submissionId,
      error: {
        code: reelExamplesError.code,
        message: 'Main submission succeeded but failed to save reel examples: ' + reelExamplesError.message,
        details: reelExamplesError.details
      }
    };
  }
  
  console.log('Reel examples inserted successfully');
  return { success: true, submissionId };
}
