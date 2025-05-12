
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type EmailData = {
  to: string;
  subject: string;
  body: string;
};

// This function is no longer needed with our alternative approach
export const initializeEmailJS = () => {
  // This is kept as a no-op to avoid breaking existing code
  console.log("Using alternative email submission method");
};

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
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      cell_phone: formData.cellPhone,
      website: formData.website,
      problem_solved: formData.problemSolved,
      tone: tones,
      other_tone: formData.otherTone || null,
      duration: formData.duration,
      other_duration: formData.otherDuration || null,
      footage_link: formData.footageLink,
      footage_types: footageTypes,
      other_footage_type: formData.otherFootageType || null,
      script_structure: formData.scriptStructure,
      non_negotiable_clips: formData.nonNegotiableClips,
      testimonials: formData.testimonials,
      logo_folder_link: formData.logoFolderLink,
      credibility_markers: credibilityMarkers,
      other_credibility_marker: formData.otherCredibilityMarker || null,
      speaker_bio: formData.speakerBio,
      additional_info: formData.additionalInfo,
      status: 'new'
    };
    
    console.log('Cleaned submission object:', JSON.stringify(submission, null, 2));
    
    // First, insert the main submission
    console.log('Attempting to insert submission to Supabase...');
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (submissionError) {
      console.error('Supabase submission error:', submissionError);
      console.error('Error details:', submissionError.message, submissionError.details, submissionError.hint);
      throw submissionError;
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
        link: example.link,
        comment: example.comment
      }));
      
      console.log('Reel examples to insert:', reelExamplesToInsert);
      const { data: reelData, error: reelExamplesError } = await supabase
        .from('reel_examples')
        .insert(reelExamplesToInsert);
      
      if (reelExamplesError) {
        console.error('Reel examples error:', reelExamplesError);
        console.error('Error details:', reelExamplesError.message, reelExamplesError.details, reelExamplesError.hint);
        throw reelExamplesError;
      }
      
      console.log('Reel examples inserted successfully:', reelData);
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

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email to:', data.to);
    console.log('Subject:', data.subject);
    console.log('Body:', data.body);
    
    const response = await fetch("https://formspree.io/f/mldjazoy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.to,
        subject: data.subject,
        message: data.body,
        _subject: `Demo Reel Submission - ${new Date().toLocaleDateString()}`,
        _replyto: "no-reply@cicospace.com",
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Form submission error:', errorData);
      
      // Mark the stored form data as failed
      const storedData = loadFormFromStorage();
      if (storedData) {
        storedData.status = 'failed';
        localStorage.setItem('demoReelFormData', JSON.stringify(storedData));
      }
      
      throw new Error(errorData.message || "Form submission failed");
    }
    
    // Clear stored form data on successful submission
    clearStoredFormData();
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Format submission data into an email body
export const formatEmailBody = (formData: any): string => {
  let body = `Demo Reel Submission\n\n`;
  
  // Contact Information
  body += `== CONTACT INFORMATION ==\n`;
  body += `Name: ${formData.firstName} ${formData.lastName}\n`;
  body += `Email: ${formData.email}\n`;
  body += `Cell Phone: ${formData.cellPhone}\n`;
  body += `Website: ${formData.website}\n`;
  body += `Problem Solved: ${formData.problemSolved}\n`;
  
  // Project Preferences
  body += `\n== PROJECT PREFERENCES ==\n`;
  body += `Tones: ${formData.tones.join(', ')}\n`;
  if (formData.tones.includes('other')) {
    body += `Other tone: ${formData.otherTone}\n`;
  }
  body += `Duration: ${formData.duration}\n`;
  if (formData.duration === 'other') {
    body += `Other duration: ${formData.otherDuration}\n`;
  }
  
  // Reel Examples
  body += `\nReel Examples:\n`;
  if (formData.reelExamples.length === 0) {
    body += `No examples provided\n`;
  } else {
    formData.reelExamples.forEach((example: any, index: number) => {
      body += `Example ${index + 1}: ${example.link} - ${example.comment}\n`;
    });
  }
  
  // Footage Submission
  body += `\n== FOOTAGE SUBMISSION ==\n`;
  body += `Footage Link: ${formData.footageLink}\n`;
  body += `Footage Types: ${formData.footageTypes.join(', ')}\n`;
  if (formData.footageTypes.includes('other')) {
    body += `Other footage type: ${formData.otherFootageType}\n`;
  }
  
  // Creative Direction
  body += `\n== CREATIVE DIRECTION ==\n`;
  body += `Script Structure: ${formData.scriptStructure}\n\n`;
  body += `Non-Negotiable Clips: ${formData.nonNegotiableClips}\n`;
  
  // Credibility & Social Proof
  body += `\n== CREDIBILITY & SOCIAL PROOF ==\n`;
  body += `Testimonials: ${formData.testimonials}\n`;
  body += `Logo Folder Link: ${formData.logoFolderLink}\n`;
  body += `Credibility Markers: ${formData.credibilityMarkers.join(', ')}\n`;
  if (formData.credibilityMarkers.includes('other')) {
    body += `Other credibility marker: ${formData.otherCredibilityMarker}\n`;
  }
  body += `Speaker Bio: ${formData.speakerBio}\n`;
  body += `Branding Guidelines: ${formData.brandingGuidelinesFiles.length > 0 ? 'Uploaded' : 'None provided'}\n`;
  
  // Additional Info
  body += `\n== ADDITIONAL INFORMATION ==\n`;
  body += `${formData.additionalInfo}\n`;
  
  // Files note
  body += `\nNote: Any uploaded files were not included in this email. Please check the form system for attached files.\n`;
  
  return body;
};
