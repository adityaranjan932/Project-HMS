import React, { useState } from "react";
import { apiConnector } from "../../services/apiconnector";

const EmailMobileVerification = ({ formData, handleChange, onOtpVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [isOtpVerifiedLocal, setIsOtpVerifiedLocal] = useState(false);

  // Check email existence in database before allowing to proceed
  const checkEmailExists = async () => {
    if (!formData.email) {
      alert("Please enter your email address first.");
      return null;
    }

    try {
      setIsCheckingEmail(true);
      const response = await apiConnector(
        "POST",
        "/auth/check-email",
        { email: formData.email }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking email:", error);
      if (error.response?.status === 409) {
        setEmailExists(true);
        setAccountStatus(error.response.data.status || "registered");
        return error.response.data;
      }
      return null;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address before sending OTP.");
      return;
    }
    setIsCheckingEmail(true);
    try {
      // Check if email is already registered
      const emailCheck = await checkEmailExists();
      if (emailCheck?.exists) {
        setEmailExists(true);
        alert(`This email is already registered. Please login instead.`);
        setIsCheckingEmail(false);
        return;
      }
      // Send OTP
      const response = await apiConnector(
        "POST",
        "/auth/send-otp",
        { email: formData.email }
      );
      setOtpSent(true);
      alert("OTP sent to your email.");
      // Optionally store OTP expiration
      if (response.data.expiresAt) {
        localStorage.setItem('otpExpiresAt', response.data.expiresAt);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP to verify.");
      return;
    }
    setIsVerifying(true);
    try {
      const verifyRes = await apiConnector(
        "POST",
        "/auth/verify-otp",
        { email: formData.email, otp: formData.otp }
      );
      if (verifyRes.data.success) {
        alert("OTP verified successfully!");
        setIsOtpVerifiedLocal(true);
        onOtpVerified(true); // Enable Next button in parent
      } else {
        alert("Invalid OTP. Please try again.");
        setIsOtpVerifiedLocal(false);
        onOtpVerified(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify OTP");
      setIsOtpVerifiedLocal(false);
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
          {emailExists && (
            <p className="text-xs text-red-500 mt-1">
              This email is already registered. Please use a different email or login.
            </p>
          )}
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
              disabled={!otpSent}
            />
            {otpSent && !isOtpVerifiedLocal && !isVerifying ? (
              <button
                className={`px-4 py-2 ${
                  isVerifying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500`}
                onClick={verifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            ) : !otpSent ? (
              <button
                className={`px-4 py-2 ${
                  isCheckingEmail
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                onClick={sendOtp}
              >
                Send OTP
              </button>
            ) : null}
          </div>
          {otpSent && !isOtpVerifiedLocal && (
            <button
              className="mt-2 text-sm text-indigo-600 hover:underline"
              onClick={sendOtp}
              disabled={isCheckingEmail}
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
