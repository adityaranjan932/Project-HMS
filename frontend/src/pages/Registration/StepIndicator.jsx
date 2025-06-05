import React from "react";

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8 relative px-2 sm:px-0">
      {/* Progress bar */}
      <div className="absolute h-0.5 sm:h-1 bg-gray-200 top-4 sm:top-5 left-4 sm:left-0 right-4 sm:right-0 z-0">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${(currentStep - 1) * 25}%` }}
        ></div>
      </div>

      {/* Step indicators */}
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-xs sm:text-sm font-medium
              ${
                currentStep >= stepNumber
                  ? "bg-indigo-600 text-white shadow-md sm:shadow-lg"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {stepNumber}
          </div>
          <div
            className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium text-center max-w-[60px] sm:max-w-none leading-tight ${
              currentStep >= stepNumber ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            {stepNumber === 1 && (
              <span className="hidden sm:inline">Personal Info</span>
            )}
            {stepNumber === 1 && <span className="sm:hidden">Personal</span>}
            {stepNumber === 2 && (
              <span className="hidden sm:inline">Verification</span>
            )}
            {stepNumber === 2 && <span className="sm:hidden">Verify</span>}
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
