import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const ProvostLogin = () => {
  const handleSubmit = () => {
    window.location.href = "/provost-login";
  };
  return (
    <div>
      <Navbar />
      <LoginComp url="/provost-login" onSubmit={handleSubmit} />
    </div>
  );
};

export default ProvostLogin;
