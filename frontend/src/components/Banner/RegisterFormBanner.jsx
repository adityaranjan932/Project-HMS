import React from "react";

const RegisterFormBanner = () => {
  return (
    <div className="register-form-container flex flex-col items-center p-6 min-h-fit">
      <div className="banner text-center bg-white shadow-lg rounded-xl p-8 mb-6 transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Instructions to Fill the Form
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          Please follow the steps below to complete your registration process:
        </p>
        <div className="steps-diagram flex items-center justify-center space-x-6">
          <div className="step flex flex-col items-center">
            <span className="step-number bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 shadow-md">
              1
            </span>
            <p className="text-gray-800 font-medium">Complete Details</p>
          </div>
          <div className="arrow text-gray-500 text-2xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 shadow-md">
              2
            </span>
            <p className="text-gray-800 font-medium">Email Verification</p>
          </div>
          <div className="arrow text-gray-500 text-2xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 shadow-md">
              3
            </span>
            <p className="text-gray-800 font-medium">Hostel Selection</p>
          </div>
          <div className="arrow text-gray-500 text-2xl">→</div>
          <div className="step flex flex-col items-center">
            <span className="step-number bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2 shadow-md">
              4
            </span>
            <p className="text-gray-800 font-medium">Final Submission</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFormBanner;
