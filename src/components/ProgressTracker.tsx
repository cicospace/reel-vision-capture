
import React from 'react';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-white">Step {currentStep} of {totalSteps}</div>
        <div className="text-sm text-white/70">{Math.round((currentStep / totalSteps) * 100)}% Complete</div>
      </div>
      
      <div className="flex w-full h-2 bg-black/20 rounded-full overflow-hidden">
        <div
          className="bg-reel-gold h-2 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <React.Fragment key={step}>
            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
              step <= currentStep ? 'bg-reel-gold text-black' : 'bg-black/20 text-white/70'
            }`}>
              {step}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
