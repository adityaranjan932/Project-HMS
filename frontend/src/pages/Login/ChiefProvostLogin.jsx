import React, { useState } from "react";
import LoginComp from "../../components/LoginComp/LoginComp";
import Navbar from "../../components/Navbar/Navbar";

const ChiefProvostLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    // Add a small delay to show the loading state before redirect
    setTimeout(() => {
      window.location.href = "/chief-provost-login";
    }, 500);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoginComp
        url="/chief-provost-login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChiefProvostLogin;
