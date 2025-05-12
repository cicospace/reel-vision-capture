
import React from 'react';
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/context/FormContext";

const FormNavigation: React.FC = () => {
  const { formState, nextStep, prevStep } = useFormContext();
  const totalSteps = 6;

  return (
    <div className="flex justify-between mt-6">
      {formState.step > 1 ? (
        <Button type="button" variant="outline" onClick={prevStep}>
          Previous
        </Button>
      ) : (
        <div></div>
      )}
      
      {formState.step < totalSteps ? (
        <Button type="button" onClick={nextStep} className="bg-black hover:bg-gray-800">
          Continue
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default FormNavigation;
