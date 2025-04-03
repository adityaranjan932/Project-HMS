import React from "react";

const RegisterFormBanner = () => {
  return (
    <div className="register-form-container flex flex-col items-center p-6 bg-gray-100">
      <div className="banner text-center bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Instructions to Fill the Form
        </h2>
        <p className="text-gray-600 mb-6">
          Please follow the steps below to complete your registration process:
        </p>
        <div className="steps-diagram flex items-center justify-center space-x-4">
          <div className="step flex flex-col items-center">
            <span className="step-number bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">
              1
            </span>
            <p className="text-gray-700">Complete Details</p>
          </div>
          <div className="arrow text-gray-500 text-xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">
              2
            </span>
            <p className="text-gray-700">Email Verification</p>
          </div>
          <div className="arrow text-gray-500 text-xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">
              3
            </span>
            <p className="text-gray-700">Hostel Selection</p>
          </div>
          <div className="arrow text-gray-500 text-xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">
              4
            </span>
            <p className="text-gray-700">Final Submission</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFormBanner;
