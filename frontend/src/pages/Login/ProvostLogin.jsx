import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-hot-toast"; // Import toast
import { provostLogin } from "../../services/auth"; // Import the new provostLogin service

const ProvostLogin = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (credentials) => {
    const toastId = toast.loading("Logging in...");
    try {
      const response = await provostLogin(credentials); // Call the service
      console.log("Provost Login API Response:", response);

      if (response && response.data && response.data.success) {
        // Store token and user info in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({ role: response.data.role, email: credentials.email })); // Store basic user info

        toast.success(response.data.message || "Login successful!");
        // Redirect to the provost dashboard
        navigate("/provost-login"); 
      } else {
        toast.error(response?.data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Provost Login Error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login. Please try again.");
    }
    toast.dismiss(toastId);
  };

  return (
    <div>
      <Navbar />
      {/* Pass the API endpoint path if your LoginComp expects it, otherwise it's not needed if handleSubmit handles the API call */}
      <LoginComp onSubmit={handleSubmit} />
    </div>
  );
};

export default ProvostLogin;
