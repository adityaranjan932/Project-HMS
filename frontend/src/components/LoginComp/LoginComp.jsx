import React, { useState } from "react";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import ForgotPassword from "./ForgotPassword";

const LoginComp = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Add login logic here (e.g., API call)
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Show Forgot Password component if requested
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl lg:shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 lg:mb-8 text-gray-800 leading-tight">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 lg:space-y-6"
        >
          <div className="flex items-center border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <FaEnvelope className="text-gray-500 mr-2 sm:mr-3 text-sm sm:text-base flex-shrink-0" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full outline-none text-sm sm:text-base lg:text-lg placeholder-gray-400 focus:placeholder-gray-300"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <FaLock className="text-gray-500 mr-2 sm:mr-3 text-sm sm:text-base flex-shrink-0" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full outline-none text-sm sm:text-base lg:text-lg placeholder-gray-400 focus:placeholder-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 lg:py-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base lg:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] sm:min-h-[48px] transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2 text-sm sm:text-base" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center mt-3 sm:mt-4">
            <button
              onClick={handleForgotPasswordClick}
              className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm lg:text-base transition-colors duration-200 p-1"
            >
              Forgot Password?
            </button>
          </div>
          <div className="text-center mt-2 sm:mt-3">
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm lg:text-base transition-colors duration-200 p-1"
            >
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComp;
