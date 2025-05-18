import { supabase } from "@/integrations/supabase/client";
import { logAuthState, logSupabaseConnection } from "../loggingUtils";
import { prepareSubmissionData } from "./submissionDataFormatter";
import { handleReelExamples } from "./reelExamplesService";
import { SubmissionResponse, Submission } from "../types";

// Main function to save form data to Supabase
export const saveFormToSupabase = async (formData: any): Promise<SubmissionResponse> => {
  try {
    console.log('Saving submission to Supabase...');
    console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
    
    // Log authentication and connection state
    await logAuthState();
    logSupabaseConnection();
    
    // Validate required fields before submission
    const missingFields = validateRequiredFields(formData);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return { 
        success: false, 
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: `Missing required fields: ${missingFields.join(', ')}`,
          details: { missingFields }
        }
      };
    }
    
    // Create a clean submission object
    const submission = prepareSubmissionData(formData);
    console.log('Cleaned submission object:', JSON.stringify(submission, null, 2));
    console.log('Submission keys:', JSON.stringify(Object.keys(submission)));
    
    // Final validation of prepared data
    if (!submission.first_name || !submission.last_name || !submission.email || !submission.cell_phone) {
      console.error('Critical required fields still missing after preparation');
      return {
        success: false,
        error: {
          code: 'INVALID_SUBMISSION_DATA',
          message: 'Critical required fields are missing',
          details: { submission }
        }
      };
    }
    
    // Get session information directly before submission attempt
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Auth session before submission:', {
      hasSession: !!sessionData.session,
      role: sessionData.session ? 'authenticated' : 'anon',
      expiresAt: sessionData.session ? new Date(sessionData.session.expires_at * 1000).toISOString() : 'N/A'
    });
    
    // Log request details that will be used
    console.log('Attempting to insert submission to Supabase...');
    console.log('Supabase URL:', "https://hxcceigrkxcaxsiikuvs.supabase.co");
    console.log('FROM call:', 'submissions');
    console.log('Client config:', {
      persistSession: false,
      autoRefreshToken: false
    });
    
    // Insert the main submission with proper await and error checking
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([submission as Submission])
      .select();
    
    if (submissionError) {
      return handleSubmissionError(submissionError);
    }
    
    // Log successful insert data
    console.log('Insert success:', submissionData);
    
    if (!submissionData || submissionData.length === 0) {
      console.error('No submission data returned from Supabase');
      return { 
        success: false, 
        error: {
          code: 'NO_DATA_RETURNED',
          message: 'No submission data returned from database'
        } 
      };
    }
    
    const submissionId = submissionData[0].id;
    console.log('Submission created with ID:', submissionId);
    
    // Insert reel examples if they exist
    if (formData.reelExamples && formData.reelExamples.length > 0) {
      return await handleReelExamples(formData.reelExamples, submissionId);
    }
    
    return { success: true, submissionId };
  } catch (error: any) {
    console.error('Error saving to Supabase:', error);
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    return { 
      success: false, 
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        details: error
      }
    };
  }
};

// Helper function to validate required fields
function validateRequiredFields(formData: any): string[] {
  const requiredFields = [
    { field: 'firstName', name: 'first_name' },
    { field: 'lastName', name: 'last_name' },
    { field: 'email', name: 'email' },
    { field: 'cellPhone', name: 'cell_phone' },
    { field: 'website', name: 'website' },
    { field: 'problemSolved', name: 'problem_solved' },
    { field: 'tones', name: 'tone', isArray: true },
    { field: 'duration', name: 'duration' },
    { field: 'footageLink', name: 'footage_link' },
    { field: 'footageTypes', name: 'footage_types', isArray: true },
    { field: 'scriptStructure', name: 'script_structure' },
    { field: 'nonNegotiableClips', name: 'non_negotiable_clips' },
    { field: 'testimonials', name: 'testimonials' },
    { field: 'logoFolderLink', name: 'logo_folder_link' },
    { field: 'credibilityMarkers', name: 'credibility_markers', isArray: true },
    { field: 'speakerBio', name: 'speaker_bio' },
    { field: 'additionalInfo', name: 'additional_info' }
  ];
  
  const missingFields: string[] = [];
  
  for (const { field, name, isArray } of requiredFields) {
    if (isArray) {
      if (!Array.isArray(formData[field])) {
        missingFields.push(`${name} (should be an array)`);
      }
    } else if (formData[field] === undefined || formData[field] === null) {
      missingFields.push(name);
    }
  }
  
  return missingFields;
}

// Helper function to handle submission errors
function handleSubmissionError(submissionError: any): SubmissionResponse {
  console.error('Supabase submission error:', submissionError);
  console.error('Error message:', submissionError.message);
  console.error('Error code:', submissionError.code);
  console.error('Error details:', submissionError.details);
  
  // Enhanced RLS error detection and logging
  if (submissionError.code === '42501') {
    console.error('RLS VIOLATION: This is likely a Row Level Security policy issue');
    console.error('Check that the anon role has INSERT permission on submissions table');
    console.error('Check that an appropriate RLS policy exists for anonymous inserts');
    console.error('Suggested fix: Run the SQL provided to grant INSERT permission and create proper policies');
  } else if (submissionError.code === 'PGRST301' || submissionError.message.includes('permission denied')) {
    console.error('PERMISSION DENIED: The current role does not have permission to perform this action');
    console.error('Ensure the anon role has been granted INSERT permission on the submissions table');
  } else if (submissionError.code === '23502') {
    console.error('NOT NULL VIOLATION: A required column value was not provided');
    console.error('Check the error details for which column is missing a value');
    console.error('Ensure all required fields are included in the submission data');
  }
  
  return { 
    success: false, 
    error: {
      code: submissionError.code,
      message: submissionError.message,
      details: {
        hint: submissionError.hint,
        details: submissionError.details
      }
    } 
  };
}
