
import React from 'react';

type ProgressTrackerProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`progress-step ${
                index + 1 < currentStep ? 'completed' : index + 1 === currentStep ? 'active' : 'incomplete'
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`progress-line ${
                  index + 1 < currentStep ? 'completed' : index + 1 === currentStep ? 'active' : 'incomplete'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <div>Project Details</div>
        <div>Footage</div>
        <div>Creative Direction</div>
        <div>Credibility</div>
        <div>Review</div>
      </div>
    </div>
  );
};

export default ProgressTracker;
