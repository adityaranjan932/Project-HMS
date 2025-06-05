import React, { useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { useNavigate } from "react-router-dom";

const Submit = ({ formData }) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    alert(
      "You are about to submit your application. Please confirm all details are correct."
    );
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Send all profile details to backend (not user creation)
      const response = await apiConnector(
        "POST",
        "/auth/registered-student-profile",
        {
          email: formData.email,
          studentName: formData.studentName,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          gender: formData.gender,
          department: formData.courseName,
          courseName: formData.courseName,
          semester: formData.semester,
          rollno: formData.rollno,
          sgpaOdd: formData.sgpaOdd,
          sgpaEven: formData.sgpaEven,
          roomPreference: formData.roomPreference,
          admissionYear: new Date().getFullYear(),
          contactNumber: formData.mobile,
          password: formData.password, // Ensure password is sent for user creation
        }
      );
      if (response.data.success) {
        alert("Application submitted successfully!");
        setSuccess(true);
        setTimeout(() => {
          navigate("/login/student-login");
        }, 2000);
      } else if (
        response.data.message &&
        response.data.message.includes("already registered")
      ) {
        setError(
          "A user with this email already exists. Please login or use a different email."
        );
      } else if (response.data.message) {
        setError(response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError("Registration failed: " + err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-4 sm:space-y-6 text-center animate-fadeIn px-2 sm:px-0">
      {!success ? (
        <>
          <div className="text-green-600 text-4xl sm:text-6xl mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Ready to Submit
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md mx-auto leading-relaxed">
            By clicking the submit button, you confirm that all the information
            provided is correct and agree to the terms and conditions.
          </p>
          <div className="mt-4 sm:mt-6 bg-gray-50 p-3 sm:p-4 rounded-lg inline-block max-w-full">
            <label className="flex items-start sm:items-center space-x-2 sm:space-x-3 cursor-pointer text-left">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 rounded focus:ring-indigo-500 mt-0.5 sm:mt-0 flex-shrink-0 touch-manipulation"
              />
              <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-3 rounded-lg border border-red-100 mx-auto max-w-md">
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !agreeToTerms}
            className={`mt-4 w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 ${
              isSubmitting || !agreeToTerms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px] touch-manipulation text-sm sm:text-base`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
          <div className="text-xs text-gray-500 mt-3 sm:mt-4 max-w-sm mx-auto">
            You will receive a confirmation email once your application is
            processed.
          </div>
        </>
      ) : (
        <div className="animate-fadeIn">
          <div className="text-green-600 text-4xl sm:text-6xl mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700">
            Registration Successful!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md mx-auto mt-3 sm:mt-4 leading-relaxed">
            Your application has been submitted successfully.
          </p>
        </div>
      )}
    </div>
  );
};

export default Submit;
