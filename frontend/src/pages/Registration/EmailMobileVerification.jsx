import React, { useState } from "react";
import axios from "axios";

const EmailMobileVerification = ({ formData, handleChange, onOtpVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address before sending OTP.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/send-otp",
        { email: formData.email }
      );
      alert(response.data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error in sendOtp:", error);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP to verify.");
      return;
    }

    try {
      setIsVerifying(true);
      console.log("Verifying OTP with payload:", {
        email: formData.email,
        otp: formData.otp,
      }); // Debugging
      const response = await axios.post(
        "http://localhost:4000/api/auth/verify-otp", // Ensure this matches the backend route
        { email: formData.email, otp: formData.otp }
      );
      if (response.data.success) {
        alert("OTP verified successfully!");
        onOtpVerified(true);
      } else {
        alert("Invalid OTP. Please try again.");
        onOtpVerified(false);
      }
    } catch (error) {
      console.error("Error in verifyOtp:", error); // Log full error object
      alert(error.response?.data?.message || "Failed to verify OTP");
      onOtpVerified(false);
    } finally {
      setIsVerifying(false);
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
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300`}
            required
            placeholder="Confirm your password"
          />
          {formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match.
              </p>
            )}
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
            {otpSent ? (
              <button
                className={`px-4 py-2 ${
                  isVerifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                onClick={verifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            )}
          </div>
          {otpSent && (
            <button
              className="mt-2 text-sm text-indigo-600 hover:underline"
              onClick={sendOtp}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Fields marked with * are required
      </div>
    </div>
  );
};

export default EmailMobileVerification;
