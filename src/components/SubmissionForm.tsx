
import React from 'react';
import ProgressTracker from "./ProgressTracker";
import ContactInfoSection from "./form-sections/ContactInfoSection";
import ProjectPreferencesSection from "./form-sections/ProjectPreferencesSection";
import FootageSection from "./form-sections/FootageSection";
import CreativeDirectionSection from "./form-sections/CreativeDirectionSection";
import CredibilitySection from "./form-sections/CredibilitySection";
import FinalDetailsSection from "./form-sections/FinalDetailsSection";
import FormNavigation from "./form-sections/FormNavigation";
import { FormProvider, useFormContext } from "@/context/FormContext";

const FormContent: React.FC = () => {
  const { formState } = useFormContext();
  
  const renderStepContent = () => {
    switch (formState.step) {
      case 1:
        return <ContactInfoSection />;
      case 2:
        return <ProjectPreferencesSection />;
      case 3:
        return <FootageSection />;
      case 4:
        return <CreativeDirectionSection />;
      case 5:
        return <CredibilitySection />;
      case 6:
        return <FinalDetailsSection />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressTracker currentStep={formState.step} totalSteps={6} />
      
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        <FormNavigation />
      </form>
    </div>
  );
};

const SubmissionForm: React.FC = () => {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
};

export default SubmissionForm;
