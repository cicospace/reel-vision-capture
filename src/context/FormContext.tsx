
import React, { createContext, useContext } from 'react';
import { FormContextType, FormState, initialFormState } from './form/types';
import { useFormStorage } from './form/useFormStorage';
import { useFormNavigation } from './form/useFormNavigation';
import { useFormSubmission } from './form/useFormSubmission';
import { validateEmail, validatePhoneNumber } from './form/validation';

export { FormState, initialFormState };
export type { FormContextType, ReelExample } from './form/types';

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
  // Use our custom hooks to manage different aspects of the form
  const { formState, setFormState, updateForm } = useFormStorage();
  const { nextStep, prevStep } = useFormNavigation(formState, updateForm);
  const { isSubmitting, setIsSubmitting, handleSubmit } = useFormSubmission(formState, setFormState, updateForm);

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
