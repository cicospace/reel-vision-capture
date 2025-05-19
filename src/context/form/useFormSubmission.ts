import { useState } from 'react';
import { FormState } from './types';
import { saveFormToSupabase } from "@/utils/formSubmission";
import { toast } from "sonner";
import { clearStoredFormData, loadFormFromStorage, saveFormToStorage } from "@/utils/formStorage";

export const useFormSubmission = (
  formState: FormState,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>,
  updateForm: (key: keyof FormState, value: any) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("Checking for brandingGuidelinesFilesLink:", formState.brandingGuidelinesFilesLink);
      
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
      setFormState({
        ...formState,
        step: 1,
      });
      
    } catch (error: any) {
      console.error('Unexpected submission error:', error);
      toast.error("Error submitting form", {
        description: "Your data has been saved locally. You can try submitting again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, setIsSubmitting, handleSubmit };
};
