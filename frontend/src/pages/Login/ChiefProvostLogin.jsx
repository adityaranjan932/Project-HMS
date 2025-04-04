import React from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const ChiefProvostLogin = () => {
  const handleSubmit = () => {
    window.location.href = "/chief-provost-login";
  };
  return (
    <div>
      <Navbar />
      <LoginComp url="/chief-provost-login" onSubmit={handleSubmit} />
    </div>
  );
};

export default ChiefProvostLogin;
