import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import Navbar from "../../components/Navbar/Navbar";

const Register = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <Navbar />
      {/* Responsive container with mobile-first padding and margins */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Responsive heading with proper scaling */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center sm:text-left">
            Instructions to fill the form:
          </h1>

          {/* Responsive list with better spacing */}
          <ul className="list-disc ml-4 sm:ml-5 md:ml-6 text-gray-700 space-y-2 sm:space-y-3 text-sm sm:text-base">
            <li className="leading-relaxed">
              Fill in all the required fields.
            </li>
            <li className="leading-relaxed">
              Ensure that the email address is valid.
            </li>
            <li className="leading-relaxed">
              Provide accurate information for a smooth registration process.
            </li>
            <li className="leading-relaxed">
              Review your information before submitting.
            </li>
            <li className="leading-relaxed">
              Contact support if you encounter any issues.
            </li>
          </ul>

          {/* Enhanced responsive button with better touch targets */}
          <div className="mt-6 sm:mt-8 md:mt-10 text-center sm:text-left">
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 shadow-md transform hover:scale-105 transition-all duration-200 min-h-[44px] sm:min-h-[48px]"
              onClick={() => navigate("/registration")} // to registration form
            >
              Start Registration
            </button>
          </div>

          {/* Additional mobile helper text */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
