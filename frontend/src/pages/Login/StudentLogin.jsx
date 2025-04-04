import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const StudentLogin = () => {
  const handleSubmit = () => {
    window.location.href = "/student-login";
  };

  return (
    <div>
      <Navbar />
      <LoginComp url="/student-login" onSubmit={handleSubmit} />
    </div>
  );
};

export default StudentLogin;
