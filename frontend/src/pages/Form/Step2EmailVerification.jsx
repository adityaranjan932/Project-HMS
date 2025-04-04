import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";

const Step2EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyEmail = () => {
    // Simulate email verification process
    setIsVerified(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Email Verification
        </h1>
        <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
          Please verify your email to proceed.
        </p>
        {!isVerified ? (
          <>
            <div className="flex items-center border rounded mb-4 p-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={handleVerifyEmail}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Verify Email
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center border rounded mb-4 p-2">
              <FaKey className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center border rounded mb-4 p-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Set your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none text-sm sm:text-base"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm sm:text-base">
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Step2EmailVerification;
