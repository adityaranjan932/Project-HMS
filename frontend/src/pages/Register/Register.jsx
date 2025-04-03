import React from "react";
import RegisterFormBanner from "../../components/Banner/RegisterFormBanner";
import Step1Register from "../Form/Step1Register";
import Step2EmailVerification from "../Form/Step2EmailVerification";
import Step3HostelSelection from "../Form/Step3HostelSelection";

const Register = () => {
  return (
    <div className="bg-gray-100">
      <RegisterFormBanner />
      <Step1Register />
      <Step2EmailVerification />
      <Step3HostelSelection />
    </div>
  );
};

export default Register;
