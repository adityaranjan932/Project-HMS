import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Submit = ({ formData }) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    alert('You are about to submit your application. Please confirm all details are correct.');
    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions before submitting.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Send all profile details to backend (not user creation)
      const response = await axios.post(
        'http://localhost:4000/api/auth/student-profile',
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
          contactNumber: formData.mobile
        }
      );
      if (response.data.success) {
        alert('Application submitted');
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-center animate-fadeIn">
      {!success ? (
        <>
          <div className="text-green-600 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Ready to Submit</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            By clicking the submit button, you confirm that all the information provided is correct and agree to the terms and conditions.
          </p>
          <div className="mt-6 bg-gray-50 p-4 rounded-lg inline-block">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !agreeToTerms}
            className={`mt-4 px-8 py-3 ${
              isSubmitting || !agreeToTerms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
          <div className="text-xs text-gray-500 mt-4">
            You will receive a confirmation email once your application is processed.
          </div>
        </>
      ) : (
        <div className="animate-fadeIn">
          <div className="text-green-600 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-700">Registration Successful!</h2>
          <p className="text-gray-600 max-w-md mx-auto mt-4">
            Your application has been submitted successfully.
          </p>
        </div>
      )}
    </div>
  );
};

export default Submit;