import React from 'react';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      {/* Progress bar */}
      <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0 z-0">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${(currentStep - 1) * 25}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center z-10">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${currentStep >= stepNumber 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'}`}
          >
            {stepNumber}
          </div>
          <div className={`text-xs mt-2 font-medium ${currentStep >= stepNumber ? 'text-indigo-600' : 'text-gray-500'}`}>
            {stepNumber === 1 && "Personal Info"}
            {stepNumber === 2 && "Verification"}
            {stepNumber === 3 && "Hostel"}
            {stepNumber === 4 && "Preview"}
            {stepNumber === 5 && "Submit"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
