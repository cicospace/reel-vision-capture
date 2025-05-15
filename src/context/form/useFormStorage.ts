
import { useState, useEffect } from 'react';
import { FormState, initialFormState } from './types';
import { loadFormFromStorage, saveFormToStorage } from "@/utils/emailService";
import { toast } from "sonner";

export const useFormStorage = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const updateForm = (key: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  // Load saved form data on initial render
  useEffect(() => {
    const savedData = loadFormFromStorage();
    if (savedData) {
      toast.info("Found saved form data", {
        description: "Your previous form data has been restored.",
        action: {
          label: "Clear",
          onClick: () => {
            localStorage.removeItem('formData');
            setFormState(initialFormState);
          }
        }
      });
      setFormState(prev => ({ ...prev, ...savedData.data }));
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (JSON.stringify(formState) !== JSON.stringify(initialFormState)) {
      saveFormToStorage(formState);
    }
  }, [formState]);

  return { formState, setFormState, updateForm };
};
