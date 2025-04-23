import React from "react";
import axios from "axios"; // Import axios for API calls

const EmailMobileVerification = ({ formData, handleChange }) => {
  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address before sending OTP.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/send-otp", // Ensure this matches the backend route
        { email: formData.email }
      );
      alert(response.data.message); // Notify user of OTP sent
    } catch (error) {
      console.error("Error in sendOtp:", error); // Log error for debugging
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Email & Mobile Verification
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="Enter your email address"
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll send a verification code to this email
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
              +91
            </span>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              required
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification OTP *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              placeholder="Enter OTP"
              required
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={sendOtp} // Attach sendOtp function
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Fields marked with * are required
      </div>
    </div>
  );
};

export default EmailMobileVerification;
