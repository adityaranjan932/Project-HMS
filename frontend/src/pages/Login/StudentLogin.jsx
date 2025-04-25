import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
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
    }
  };

  return (
    <div>
      <Navbar />
      <LoginComp url="/student-login" onSubmit={handleSubmit} />
    </div>
  );
};

export default StudentLogin;
