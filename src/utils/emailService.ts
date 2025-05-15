
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Add a new type for form data persistence
export type StoredFormData = {
  timestamp: string;
  data: any;
  status: 'draft' | 'failed';
};

// Function to save form data to localStorage
export const saveFormToStorage = (formData: any) => {
  try {
    const storedData: StoredFormData = {
      timestamp: new Date().toISOString(),
      data: formData,
      status: 'draft'
    };
    localStorage.setItem('demoReelFormData', JSON.stringify(storedData));
    console.log('Form data saved to localStorage');
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

// Function to load form data from localStorage
export const loadFormFromStorage = (): StoredFormData | null => {
  try {
    const savedData = localStorage.getItem('demoReelFormData');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

// Function to clear form data from localStorage
export const clearStoredFormData = () => {
  try {
    localStorage.removeItem('demoReelFormData');
    console.log('Form data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

// Updated function to save form data to Supabase with enhanced error handling
export const saveFormToSupabase = async (formData: any): Promise<{ success: boolean, submissionId?: string, error?: {code: string, message: string, details?: any} }> => {
  try {
    console.log('Saving submission to Supabase...');
    console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
    console.log('Using Supabase client from integrations/supabase/client.ts');
    
    // Log Supabase connection info for debugging
    console.log('Supabase connection check:', {
      hasSupabase: !!supabase,
      hasInsertMethod: !!(supabase && supabase.from)
    });
    
    // Ensure arrays are proper arrays and not empty
    const tones = Array.isArray(formData.tones) ? formData.tones : [];
    const footageTypes = Array.isArray(formData.footageTypes) ? formData.footageTypes : [];
    const credibilityMarkers = Array.isArray(formData.credibilityMarkers) ? formData.credibilityMarkers : [];
    
    // Create a clean submission object with only the fields expected by the database
    const submission = {
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
    
    console.log('Cleaned submission object:', JSON.stringify(submission, null, 2));
    
    // Insert the main submission with comprehensive error logging
    console.log('Attempting to insert submission to Supabase...');
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (submissionError) {
      console.error('Supabase submission error:', submissionError);
      console.error('Error message:', submissionError.message);
      console.error('Error code:', submissionError.code);
      console.error('Error details:', submissionError.details);
      
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
    
    // Return structured error info even for unexpected errors
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
async function handleReelExamples(reelExamples: any[], submissionId: string): Promise<{ success: boolean, submissionId?: string, error?: {code: string, message: string, details?: any} }> {
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
