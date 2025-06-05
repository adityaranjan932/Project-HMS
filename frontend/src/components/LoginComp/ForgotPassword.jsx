import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  resetPassword,
} from "../../services/auth";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    try {
      const result = await sendResetPasswordOTP(formData.email);
      if (result?.success) {
        setStep(2);
        setErrors({});
        toast.success("OTP sent successfully to your email!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    if (formData.otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    try {
      const result = await verifyResetPasswordOTP(formData.email, formData.otp);
      if (result?.success) {
        setStep(3);
        setErrors({});
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword,
        formData.confirmPassword
      );
      if (result?.success) {
        setErrors({});
        setStep(4); // Move to success step
        toast.success(
          "🎉 Password reset successfully! You can now login with your new password.",
          {
            duration: 4000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
          }
        );
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 3000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          1
        </div>
        <div
          className={`w-12 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}
        ></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          2
        </div>
        <div
          className={`w-12 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}`}
        ></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          3
        </div>
        {step >= 4 && (
          <>
            <div className="w-12 h-1 bg-green-600"></div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-600 text-white">
              ✓
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your registered email address
        </label>
        <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
          <FaEnvelope className="text-gray-500 mr-3" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full outline-none text-base placeholder-gray-400 focus:placeholder-gray-300"
            required
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter the OTP sent to {formData.email}
        </label>
        <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
          <FaKey className="text-gray-500 mr-3" />
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            className="w-full outline-none text-base placeholder-gray-400 focus:placeholder-gray-300"
            required
          />
        </div>
        {errors.otp && (
          <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition text-base font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>{" "}
      <button
        type="button"
        onClick={async () => {
          if (!loading) {
            toast.loading("Resending OTP...", { id: "resend-otp" });
            try {
              await handleSendOTP({ preventDefault: () => {} });
              toast.success("OTP resent successfully!", { id: "resend-otp" });
            } catch (error) {
              toast.error("Failed to resend OTP", { id: "resend-otp" });
            }
          }
        }}
        disabled={loading}
        className="w-full text-blue-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Didn't receive OTP? Resend
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
          <FaLock className="text-gray-500 mr-3" />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full outline-none text-base placeholder-gray-400 focus:placeholder-gray-300"
            required
          />
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
          <FaLock className="text-gray-500 mr-3" />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full outline-none text-base placeholder-gray-400 focus:placeholder-gray-300"
            required
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition text-base font-semibold"
        >
          Back
        </button>{" "}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <div className="text-green-600 text-2xl font-bold">✓</div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          Password Reset Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          Your password has been successfully reset. You can now login with your
          new password.
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to the login page automatically in a few
          seconds...
        </p>
      </div>
      <button
        onClick={onBackToLogin}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition text-base font-semibold"
      >
        Go to Login Now
      </button>
    </div>
  );
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-2 sm:mb-4 text-gray-800 leading-tight">
          Reset Password
        </h2>{" "}
        <p className="text-center text-gray-600 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg">
          {step === 1 && "Enter your email to receive an OTP"}
          {step === 2 && "Verify your identity with the OTP"}
          {step === 3 && "Create a new password"}
          {step === 4 && "Password reset completed successfully!"}
        </p>
        {renderStepIndicator()} {step === 1 && renderEmailStep()}
        {step === 2 && renderOTPStep()}
        {step === 3 && renderPasswordStep()}
        {step === 4 && renderSuccessStep()}
        {step !== 4 && (
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm lg:text-base transition-colors duration-200 p-1"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
