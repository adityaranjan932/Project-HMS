import React, { useState, useEffect } from "react";
import StepIndicator from "./StepIndicator";
import PersonalInformation from "./PersonalInformation";
import EmailMobileVerification from "./EmailMobileVerification";
import HostelSelection from "./HostelSelection";
import Preview from "./Preview";
import Submit from "./Submit";
import { apiConnector } from "../../services/apiconnector";

import RegHeader from "./RegHeader";
import RegFooter from "../../components/Footer/RegFooter";

const MultiStepForm = () => {
  const [category, setCategory] = useState("");
  const [step, setStep] = useState(1);
  const [isEligible, setIsEligible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    course: "",
    courseName: "",
    semester: "",
    examType: "",
    rollno: "",
    dateOfBirth: "",
    subject: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    sgpaOdd: "",
    sgpaEven: "",
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
    gender: "",
    roomPreference: "",
  });

  const [stepCompletion, setStepCompletion] = useState({
    1: false,
    2: false,
    3: false,
    4: true,
  });

  const handleOtpVerified = (verified) => {
    setIsOtpVerified(verified);
  };

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.course &&
          formData.semester &&
          formData.examType &&
          formData.rollno &&
          formData.dateOfBirth &&
          isEligible
        );
      case 2:
        return (
          formData.email &&
          formData.mobile &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          isOtpVerified
        );
      case 3:
        return formData.gender && formData.roomPreference;
      case 4:
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    setStepCompletion((prevCompletion) => ({
      ...prevCompletion,
      [step]: isStepComplete(step),
    }));
  }, [formData, step, isEligible, isOtpVerified]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEligibilityCheck = (eligible, studentDetails) => {
    setIsEligible(eligible);
    if (eligible && studentDetails) {
      setFormData((prevData) => ({
        ...prevData,
        studentName: studentDetails.name,
        fatherName: studentDetails.fatherName,
        sgpaOdd: studentDetails.sgpaOdd,
        sgpaEven: studentDetails.sgpaEven,
        motherName: studentDetails.motherName,
        courseName: studentDetails.courseName,
      }));
    }
  };

  const nextStep = async () => {
    if (stepCompletion[step]) {
      if (step === 2) {
        // On EmailMobileVerification step, do email verification
        try {
          const response = await apiConnector(
            "POST",
            "/auth/email-verification",
            {
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              otp: formData.otp,
              mobile: formData.mobile,
              studentName: formData.studentName || formData.name || "",
              gender: formData.gender || "",
            }
          );
          if (response.data.success) {
            setStep((prevStep) => Math.min(prevStep + 1, 5));
          } else {
            alert(response.data.message || "Registration failed.");
          }
        } catch (error) {
          alert(error.response?.data?.message || "Registration failed.");
        }
      } else {
        setStep((prevStep) => Math.min(prevStep + 1, 5));
      }
    } else {
      alert("Please complete all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <>
      <RegHeader />
      <div className="bg-stone-200 py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center p-5">
        {!category && (
          <div className="mb-8 w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Hostel Application
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Please select your application category
            </p>

            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-4 py-3 text-gray-700 bg-white border-2 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition ease-in-out duration-300"
            >
              <option value="">-- Select Category --</option>
              <option value="new">🆕 New Allotment</option>
              <option value="reallotment">🏠 Re-allotment (Old)</option>
            </select>
          </div>
        )}

        {/* Conditionally Render Form if Re-allotment selected */}
        {category === "reallotment" && (
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
            <div className="p-8">
              <StepIndicator currentStep={step} />

              <div className="">
                {step === 1 && (
                  <PersonalInformation
                    formData={formData}
                    handleChange={handleChange}
                    onEligibilityCheck={handleEligibilityCheck}
                  />
                )}
                {step === 2 && (
                  <EmailMobileVerification
                    formData={formData}
                    handleChange={handleChange}
                    onOtpVerified={handleOtpVerified}
                  />
                )}
                {step === 3 && (
                  <HostelSelection
                    formData={formData}
                    handleChange={handleChange}
                  />
                )}
                {step === 4 && <Preview formData={formData} />}
                {step === 5 && <Submit formData={formData} />}
              </div>

              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:-translate-y-1"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                {step < 5 && (
                  <button
                    className={`px-6 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-auto transform hover:-translate-y-1 ${
                      stepCompletion[step]
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-400 cursor-not-allowed text-white"
                    }`}
                    onClick={nextStep}
                    disabled={!stepCompletion[step]}
                  >
                    Next
                  </button>
                )}
                {/* No submit button here for step 5; Submit.jsx handles it */}
              </div>
            </div>
          </div>
        )}

        {/* If other category selected or none */}
        {category && category !== "reallotment" && (
          <div className="text-red-600 text-lg font-semibold mt-6">
            Hostel Registration is available only for <u>Re-allotment (Old)</u>.
          </div>
        )}
      </div>
      <RegFooter />
    </>
  );
};

export default MultiStepForm;
