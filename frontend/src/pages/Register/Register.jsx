import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import Navbar from "../../components/Navbar/Navbar";

const Register = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Instructions to fill the form:
        </h1>
        <ul className="list-disc ml-5 text-gray-700 space-y-2">
          <li>Fill in all the required fields.</li>
          <li>Ensure that the email address is valid.</li>
          <li>
            Provide accurate information for a smooth registration process.
          </li>
          <li>Review your information before submitting.</li>
          <li>Contact support if you encounter any issues.</li>
        </ul>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 mt-6 shadow-md transform hover:scale-105 transition-transform"
          onClick={() => navigate("/registration")} // too registration form
        >
          Start Registration
        </button>
      </div>
    </div>
  );
};

export default Register;
