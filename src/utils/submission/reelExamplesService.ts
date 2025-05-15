
import { supabase } from "@/integrations/supabase/client";
import { SubmissionResponse } from "../types";

// Function to insert reel examples for a submission
export const handleReelExamples = async (reelExamples: any[], submissionId: string): Promise<SubmissionResponse> => {
  try {
    console.log('Processing reel examples for submission:', submissionId);
    
    if (!submissionId) {
      console.error('Missing submission ID for reel examples');
      return {
        success: true,
        submissionId,
        error: {
          code: 'MISSING_SUBMISSION_ID',
          message: 'Submission ID is required for reel examples'
        }
      };
    }

    // Validate and prepare reel examples for insertion
    const formattedExamples = reelExamples
      .filter(example => example && example.link && example.comment) // Filter out incomplete examples
      .map(example => ({
        submission_id: submissionId,
        link: example.link || '', // Ensure link has a fallback
        comment: example.comment || '' // Ensure comment has a fallback
      }));

    if (formattedExamples.length === 0) {
      console.log('No valid reel examples to insert');
      return { success: true, submissionId };
    }

    console.log('Inserting reel examples:', JSON.stringify(formattedExamples, null, 2));
    
    // Insert reel examples
    const { error: reelError } = await supabase
      .from('reel_examples')
      .insert(formattedExamples);
    
    if (reelError) {
      console.error('Error inserting reel examples:', reelError);
      console.error('Error message:', reelError.message);
      console.error('Error details:', reelError.details);
      
      // Main submission was successful, but reel examples failed
      return {
        success: true,
        submissionId,
        error: {
          code: reelError.code,
          message: 'Submission saved but reel examples failed: ' + reelError.message,
          details: reelError
        }
      };
    }
    
    console.log(`Successfully inserted ${formattedExamples.length} reel examples`);
    return { success: true, submissionId };
  } catch (error: any) {
    console.error('Error processing reel examples:', error);
    
    // Main submission was successful, but reel examples had an unexpected error
    return { 
      success: true, 
      submissionId,
      error: {
        code: 'REEL_EXAMPLES_ERROR',
        message: 'Submission saved but reel examples failed: ' + (error.message || 'Unknown error'),
        details: error
      }
    };
  }
};
