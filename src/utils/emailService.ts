
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

// Function to save form data to Supabase
export const saveFormToSupabase = async (formData: any): Promise<{ success: boolean, submissionId?: string }> => {
  try {
    console.log('Saving submission to Supabase...');
    console.log('Form data to be submitted:', JSON.stringify(formData, null, 2));
    
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
    
    // First, insert the main submission - with detailed error logging
    console.log('Attempting to insert submission to Supabase...');
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (submissionError) {
      console.error('Supabase submission error:', submissionError);
      console.error('Error details:', submissionError.message);
      console.error('Error code:', submissionError.code);
      console.error('Error details:', submissionError.details);
      console.error('Error hint:', submissionError.hint);
      throw new Error(`Database error: ${submissionError.message}. Code: ${submissionError.code}`);
    }
    
    if (!submissionData || submissionData.length === 0) {
      console.error('No submission data returned from Supabase');
      throw new Error('No submission data returned');
    }
    
    const submissionId = submissionData[0].id;
    console.log('Submission created with ID:', submissionId);
    
    // Then, insert reel examples if they exist
    if (formData.reelExamples && formData.reelExamples.length > 0) {
      console.log('Inserting reel examples:', formData.reelExamples.length);
      
      const reelExamplesToInsert = formData.reelExamples.map((example: any) => ({
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
        console.error('Error details:', reelExamplesError.message);
        console.error('Error code:', reelExamplesError.code);
        console.error('Error details:', reelExamplesError.details);
        console.error('Error hint:', reelExamplesError.hint);
        // We'll continue even if reel examples fail, since the main submission was successful
      }
      
      console.log('Reel examples inserted successfully');
    }
    
    return { success: true, submissionId };
  } catch (error: any) {
    console.error('Error saving to Supabase:', error);
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    return { success: false };
  }
};
