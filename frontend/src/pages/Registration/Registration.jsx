import React, { useState, useEffect } from "react";
import StepIndicator from "./StepIndicator";
import PersonalInformation from "./PersonalInformation";
import EmailMobileVerification from "./EmailMobileVerification";
import HostelSelection from "./HostelSelection";
import Preview from "./Preview";
import Submit from "./Submit";
import Navbar from "../../components/Navbar/Navbar";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [isEligible, setIsEligible] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    course: "",
    semester: "",
    examType: "",
    rollno: "",
    dateOfBirth: "",
    subject: "",
    studentName: "",
    fatherName: "",
    cgpa: "",
    sgpa: "",

    // Email & Mobile Verification
    email: "",
    mobile: "",
    otp: "",

    // Hostel Selection
    hostelType: "",
    roomPreference: "",
    mealPlan: "",
  });

  const [stepCompletion, setStepCompletion] = useState({
    1: false,
    2: false,
    3: false,
    4: true, // Preview step is always complete
  });

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
        return formData.email && formData.mobile && formData.otp;
      case 3:
        return (
          formData.hostelType && formData.roomPreference && formData.mealPlan
        );
      case 4:
        return true; // Preview step is always complete
      default:
        return false;
    }
  };

  useEffect(() => {
    // Update step completion status whenever form data changes
    setStepCompletion((prevCompletion) => ({
      ...prevCompletion,
      [step]: isStepComplete(step),
    }));
  }, [formData, step, isEligible]);

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
        cgpa: studentDetails.cgpa,
        sgpa: studentDetails.sgpa,
      }));
    }
  };

  const nextStep = () => {
    if (stepCompletion[step]) {
      setStep((prevStep) => Math.min(prevStep + 1, 5));
    } else {
      alert("Please complete all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h1 className="text-3xl font-bold text-center">
              Hostel Registration Form
            </h1>
            <p className="text-center text-indigo-100 mt-2">
              Complete all steps to submit your application
            </p>
          </div>

          <div className="p-8">
            <StepIndicator currentStep={step} />

            <div className="mb-8 mt-6">
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
              {step < 5 ? (
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
              ) : (
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto transform hover:-translate-y-1"
                  onClick={() => alert("Form submitted successfully!")}
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiStepForm;
