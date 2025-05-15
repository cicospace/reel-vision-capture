
import { FormState } from './types';
import { validateStep, validateEmail, validatePhoneNumber } from './validation';
import { toast } from 'sonner';

export const useFormNavigation = (
  formState: FormState,
  updateForm: (key: keyof FormState, value: any) => void,
  totalSteps: number = 6
) => {
  const nextStep = () => {
    const { isValid, errorMessage } = validateStep(
      formState.step, 
      formState,
      validateEmail,
      validatePhoneNumber
    );

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

  return { nextStep, prevStep, validateEmail, validatePhoneNumber };
};
