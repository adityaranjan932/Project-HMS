import React, { useState } from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";
import { apiConnector } from "../../services/apiconnector";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const response = await apiConnector("POST", "/auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/student-login");
      } else {
        alert(response.data.message || "Login failed.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoginComp
        url="/student-login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StudentLogin;
