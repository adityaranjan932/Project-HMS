import React, { useState } from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const OtherLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    // Add a small delay to show the loading state before redirect
    setTimeout(() => {
      window.location.href = "/other-login";
    }, 500);
  };

  return (
    <div>
      <Navbar />
      <LoginComp
        url="/other-login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OtherLogin;
