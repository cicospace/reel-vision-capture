import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loadFormFromStorage, 
  saveFormToStorage, 
  clearStoredFormData,
  saveFormToSupabase
} from "@/utils/emailService";
import { toast } from "sonner";

export type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  website: string;
  problemSolved: string;
  
  tones: string[];
  otherTone: string;
  duration: string;
  otherDuration: string;
  reelExamples: ReelExample[];
  footageLink: string;
  footageTypes: string[];
  otherFootageType: string;
  scriptStructure: string;
  nonNegotiableClips: string;
  testimonials: string;
  logoFolderLink: string;
  deckFiles: File[];
  credibilityMarkers: string[];
  otherCredibilityMarker: string;
  speakerBio: string;
  speakerBioFiles: File[];
  brandingGuidelinesFiles: File[];
  additionalInfo: string;
  step: number;
};

export const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  cellPhone: '',
  website: '',
  problemSolved: '',
  
  tones: [],
  otherTone: '',
  duration: '',
  otherDuration: '',
  reelExamples: [],
  footageLink: '',
  footageTypes: [],
  otherFootageType: '',
  scriptStructure: '',
  nonNegotiableClips: '',
  testimonials: '',
  logoFolderLink: '',
  deckFiles: [],
  credibilityMarkers: [],
  otherCredibilityMarker: '',
  speakerBio: '',
  speakerBioFiles: [],
  brandingGuidelinesFiles: [],
  additionalInfo: '',
  step: 1,
};

interface FormContextType {
  formState: FormState;
  updateForm: (key: keyof FormState, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateEmail: (email: string) => boolean;
  validatePhoneNumber: (phone: string) => boolean;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const FormContext = createContext<FormContextType>({
  formState: initialFormState,
  updateForm: () => {},
  nextStep: () => {},
  prevStep: () => {},
  validateEmail: () => false,
  validatePhoneNumber: () => false,
  isSubmitting: false,
  setIsSubmitting: () => {},
  handleSubmit: async () => {},
});

export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6;

  const updateForm = (key: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const nextStep = () => {
    let isValid = true;
    let errorMessage = '';

    switch (formState.step) {
      case 1:
        if (!formState.firstName.trim()) {
          isValid = false;
          errorMessage = 'Please enter your first name.';
        } else if (!formState.lastName.trim()) {
          isValid = false;
          errorMessage = 'Please enter your last name.';
        } else if (!formState.email.trim()) {
          isValid = false;
          errorMessage = 'Please enter your email address.';
        } else if (!validateEmail(formState.email)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        } else if (!formState.cellPhone.trim()) {
          isValid = false;
          errorMessage = 'Please enter your cell phone number.';
        } else if (!validatePhoneNumber(formState.cellPhone)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number (at least 10 digits).';
        } else if (!formState.website.trim()) {
          isValid = false;
          errorMessage = 'Please enter your website or enter N/A if not applicable.';
        } else if (!formState.problemSolved.trim()) {
          isValid = false;
          errorMessage = 'Please describe what problem you solve.';
        }
        break;
      case 2:
        if (formState.tones.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one tone.';
        } else if (formState.tones.includes('other') && !formState.otherTone.trim()) {
          isValid = false;
          errorMessage = 'Please specify the other tone.';
        } else if (!formState.duration) {
          isValid = false;
          errorMessage = 'Please select a duration.';
        } else if (formState.duration === 'other' && !formState.otherDuration.trim()) {
          isValid = false;
          errorMessage = 'Please specify the other duration.';
        } else if (formState.reelExamples.length === 0) {
          isValid = false;
          errorMessage = 'Please add at least one reel example.';
        } else {
          for (const example of formState.reelExamples) {
            if (!example.link.trim() || !example.comment.trim()) {
              isValid = false;
              errorMessage = 'Please complete all fields for each reel example.';
              break;
            }
          }
        }
        break;
      case 3:
        if (!formState.footageLink.trim()) {
          isValid = false;
          errorMessage = 'Please provide a link to your footage.';
        } else if (formState.footageTypes.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one footage type.';
        } else if (formState.footageTypes.includes('other') && !formState.otherFootageType.trim()) {
          isValid = false;
          errorMessage = 'Please specify the other footage type.';
        }
        break;
      case 4:
        if (!formState.scriptStructure.trim()) {
          isValid = false;
          errorMessage = 'Please provide a script structure.';
        } else if (!formState.nonNegotiableClips.trim()) {
          isValid = false;
          errorMessage = 'Please provide non-negotiable clips.';
        }
        break;
      case 5:
        if (!formState.testimonials.trim()) {
          isValid = false;
          errorMessage = 'Please provide testimonials or enter N/A if not applicable.';
        } else if (!formState.logoFolderLink.trim()) {
          isValid = false;
          errorMessage = 'Please provide a link to your logos or enter N/A if not applicable.';
        } else if (formState.credibilityMarkers.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one credibility marker.';
        } else if (formState.credibilityMarkers.includes('other') && !formState.otherCredibilityMarker.trim()) {
          isValid = false;
          errorMessage = 'Please specify the other credibility marker.';
        } else if (!formState.speakerBio.trim()) {
          isValid = false;
          errorMessage = 'Please provide your speaker bio.';
        }
        break;
    }

    if (!isValid) {
      toast.error("Required Field Missing", {
        description: errorMessage,
      });
      return;
    }

    if (formState.step < totalSteps) {
      updateForm('step', formState.step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (formState.step > 1) {
      updateForm('step', formState.step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.additionalInfo.trim()) {
      toast.error("Required Field Missing", {
        description: "Please provide additional information or enter N/A if not applicable.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting form submission process...");
      console.log("Form state before submission:", JSON.stringify(formState, null, 2));
      
      // Save to Supabase with enhanced error handling
      const { success, submissionId, error } = await saveFormToSupabase(formState);
      
      if (!success) {
        console.error("Failed to save submission to database", error);
        
        // Format detailed error message for the user
        let errorMessage = "We couldn't save your submission to our database.";
        
        if (error) {
          console.error("Error details:", JSON.stringify(error, null, 2));
          errorMessage += ` Error: ${error.message}`;
          
          // Special handling for specific error codes
          if (error.code === "42501") {
            errorMessage = "Permission denied. We're working to fix this issue.";
          } else if (error.code === "23505") {
            errorMessage = "This email address is already registered.";
          } else if (error.code === "23502") {
            errorMessage = "Required information is missing.";
          }
        }
        
        toast.error("Error saving submission", {
          description: errorMessage,
        });
        
        // Mark the form as failed but keep the data for retry
        const storedData = loadFormFromStorage();
        if (storedData) {
          saveFormToStorage({...storedData.data, status: 'failed'});
        }
        
        setIsSubmitting(false);
        return;
      }
      
      console.log("Submission saved successfully with ID:", submissionId);
      
      if (error) {
        // Handle partial success (main submission worked but reel examples failed)
        toast.warning("Partial success", {
          description: error.message,
        });
      } else {
        // Show full success message
        toast.success("Form submitted successfully!", {
          description: "Your submission has been saved. We'll review it shortly.",
        });
      }
      
      // Clear form data and reset form
      clearStoredFormData();
      setFormState(initialFormState);
      updateForm('step', 1);
      
    } catch (error) {
      console.error('Unexpected submission error:', error);
      toast.error("Error submitting form", {
        description: "Your data has been saved locally. You can try submitting again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const savedData = loadFormFromStorage();
    if (savedData) {
      toast.info("Found saved form data", {
        description: "Your previous form data has been restored.",
        action: {
          label: "Clear",
          onClick: () => {
            clearStoredFormData();
            setFormState(initialFormState);
          }
        }
      });
      setFormState(prev => ({ ...prev, ...savedData.data }));
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(formState) !== JSON.stringify(initialFormState)) {
      saveFormToStorage(formState);
    }
  }, [formState]);

  return (
    <FormContext.Provider 
      value={{ 
        formState, 
        updateForm, 
        nextStep, 
        prevStep, 
        validateEmail, 
        validatePhoneNumber, 
        isSubmitting, 
        setIsSubmitting,
        handleSubmit
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
