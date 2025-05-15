
import { supabase } from "@/integrations/supabase/client";
import { logAuthState, logSupabaseConnection } from "./loggingUtils";

// Type for submission response
export type SubmissionResponse = {
  success: boolean;
  submissionId?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  }
};

// Main function to save form data to Supabase
export const saveFormToSupabase = async (formData: any): Promise<SubmissionResponse> => {
  try {
    console.log('Saving submission to Supabase...');
    console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
    
    // Log authentication and connection state
    await logAuthState();
    logSupabaseConnection();
    
    // Create a clean submission object
    const submission = prepareSubmissionData(formData);
    console.log('Cleaned submission object:', JSON.stringify(submission, null, 2));
    
    // Insert the main submission
    console.log('Attempting to insert submission to Supabase...');
    console.log('Supabase URL:', "https://hxcceigrkxcaxsiikuvs.supabase.co");
    console.log('FROM call:', 'submissions');
    
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (submissionError) {
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

// Helper function to handle reel examples insertion
async function handleReelExamples(reelExamples: any[], submissionId: string): Promise<SubmissionResponse> {
  console.log('Inserting reel examples:', reelExamples.length);
  
  const reelExamplesToInsert = reelExamples.map((example: any) => ({
    submission_id: submissionId,
    link: example.link || '',
    comment: example.comment || ''
  }));
  
  console.log('Reel examples to insert:', reelExamplesToInsert);
  const { error: reelExamplesError } = await supabase
    .from('reel_examples')
    .insert(reelExamplesToInsert);
  
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

// Helper function to prepare submission data
function prepareSubmissionData(formData: any) {
  // Ensure arrays are proper arrays and not empty
  const tones = Array.isArray(formData.tones) ? formData.tones : [];
  const footageTypes = Array.isArray(formData.footageTypes) ? formData.footageTypes : [];
  const credibilityMarkers = Array.isArray(formData.credibilityMarkers) ? formData.credibilityMarkers : [];
  
  // Create a clean submission object with only the fields expected by the database
  return {
    first_name: formData.firstName || '',
    last_name: formData.lastName || '',
    email: formData.email || '',
    cell_phone: formData.cellPhone || '',
    website: formData.website || '',
    problem_solved: formData.problemSolved || '',
    tone: tones,
    other_tone: formData.otherTone || null,
    duration: formData.duration || '',
    other_duration: formData.otherDuration || null,
    footage_link: formData.footageLink || '',
    footage_types: footageTypes,
    other_footage_type: formData.otherFootageType || null,
    script_structure: formData.scriptStructure || '',
    non_negotiable_clips: formData.nonNegotiableClips || '',
    testimonials: formData.testimonials || '',
    logo_folder_link: formData.logoFolderLink || '',
    credibility_markers: credibilityMarkers,
    other_credibility_marker: formData.otherCredibilityMarker || null,
    speaker_bio: formData.speakerBio || '',
    additional_info: formData.additionalInfo || '',
    status: 'new'
  };
}
