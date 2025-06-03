import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import ForgotPassword from "./ForgotPassword";

const LoginComp = ({ onSubmit }) => {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6 sm:px-8 lg:px-10">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full outline-none text-base sm:text-lg placeholder-gray-400 focus:placeholder-gray-300"
              required
            />
          </div>
          <div className="flex items-center border rounded-lg px-4 py-3 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full outline-none text-base sm:text-lg placeholder-gray-400 focus:placeholder-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition text-base sm:text-lg font-semibold"
          >
            Login
          </button>          <div className="text-center mt-4">
            <button
              onClick={handleForgotPasswordClick}
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              Forgot Password?
            </button>
          </div>
          <div className="text-center mt-2">
            <a
              href="/register"
              className="text-blue-600 hover:underline text-sm sm:text-base"
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
