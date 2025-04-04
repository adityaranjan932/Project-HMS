import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const OtherLogin = () => {
  const handleSubmit = () => {
    window.location.href = "/other-login";
  };
  return (
    <div>
      <Navbar />
      <LoginComp url="/other-login" onSubmit={handleSubmit} />
    </div>
  );
};

export default OtherLogin;
