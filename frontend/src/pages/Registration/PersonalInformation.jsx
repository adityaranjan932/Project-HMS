import React, { useEffect, useState } from "react";
import coursesData from "../../../utils/courseNameData.json";
import { apiConnector } from "../../services/apiconnector";

const CourseRegistrationForm = ({
  formData,
  handleChange,
  onEligibilityCheck,
}) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(null);
  const [error, setError] = useState(null);
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    sgpaOdd: "",
    sgpaEven: "",
    courseName: "",
  });

  useEffect(() => {
    setCourses(coursesData);
  }, []);

  const checkEligibility = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      if (
        !formData.course ||
        !formData.semester ||
        !formData.examType ||
        !formData.rollno ||
        !formData.dateOfBirth
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Pass year as per backend expectation
      const data = {
        CourseId: formData.course,
        year: formData.semester, // Pass year, not Semester
        ExamType: formData.examType,
        SubjectId: formData.subject,
        Rollno: formData.rollno,
        Dob: formData.dateOfBirth,
        Dob1: formData.dateOfBirth,
      };

      const response = await apiConnector(
        "POST",
        "/auth/check-eligibility",
        data
      );

      if (response.data.success) {
        const resData = response.data.data;
        const eligibility = resData.hostel_eligibility;

        if (eligibility.eligible) {
          setIsEligible(true);

          // Extract student details from the new backend structure
          const name = resData.Name || "";
          const fatherName = resData.Father_Name || "";
          const motherName = resData.Mother_Name || "";
          const courseName = resData.Course || "";

          const sgpaOdd = resData.odd_semester_result?.SGPA || "N/A";
          const sgpaEven = resData.even_semester_result?.SGPA || "N/A";

          const studentDetails = {
            name,
            fatherName,
            motherName,
            sgpaOdd,
            sgpaEven,
            courseName,
          };

          setStudentDetails(studentDetails);

          // Pass both eligibility status and student details to parent
          onEligibilityCheck(true, studentDetails);
          setError(null);
        } else {
          setIsEligible(false);
          onEligibilityCheck(false, null);
          setError(
            eligibility.message ||
              "You are not eligible for hostel registration"
          );
          setStudentDetails({
            name: "",
            fatherName: "",
            motherName: "",
            sgpaOdd: "",
            sgpaEven: "",
            courseName: "",
          });
        }
      } else {
        setIsEligible(false);
        onEligibilityCheck(false, null);
        setError(
          response.data.message ||
            "You are not eligible for hostel registration"
        );
        setStudentDetails({
          name: "",
          fatherName: "",
          motherName: "",
          sgpaOdd: "",
          sgpaEven: "",
          courseName: "",
        });
      }
    } catch (err) {
      setIsEligible(false);
      onEligibilityCheck(false, null);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while checking eligibility"
      );
      setStudentDetails({
        name: "",
        fatherName: "",
        motherName: "",
        sgpaOdd: "",
        sgpaEven: "",
        courseName: "",
      });
      console.error("Eligibility check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Personal Information
      </h2>

      {/* Student Details (Read-only) */}
      {studentDetails.name && (
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={studentDetails.name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              value={studentDetails.fatherName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Name
            </label>
            <input
              type="text"
              value={studentDetails.motherName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SGPA (Odd Semester)
            </label>
            <input
              type="text"
              value={studentDetails.sgpaOdd}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SGPA (Even Semester)
            </label>
            <input
              type="text"
              value={studentDetails.sgpaEven}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name *
          </label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name *
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Subject</option>
            <option value={formData.course}>
              {formData.course
                ? document.querySelector(`option[value="${formData.course}"]`)
                    ?.textContent || "Selected Course"
                : "Select a Course First"}
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Year *
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Year</option>
            <option value="2">2nd year</option>
            <option value="3">3rd year</option>
            <option value="4">4th year</option>
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type *
          </label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Exam Type</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll No. *
          </label>
          <input
            type="text"
            name="rollno"
            value={formData.rollno}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="Enter your roll number"
            maxLength="15"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth (DD/MM/YYYY) *
          </label>
          <input
            type="text"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="DD/MM/YYYY"
            maxLength="10"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={checkEligibility}
          disabled={
            isLoading ||
            !formData.course ||
            !formData.semester ||
            !formData.examType ||
            !formData.rollno ||
            !formData.dateOfBirth
          }
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Checking Eligibility...
            </div>
          ) : (
            "Check Eligibility"
          )}
        </button>
      </div>

      {isEligible !== null && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            isEligible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isEligible ? (
            <p className="font-medium">
              You are eligible for hostel registration!
            </p>
          ) : (
            <p className="font-medium">
              {error || "You are not eligible for hostel registration."}
            </p>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        Fields marked with * are required
      </div>
    </div>
  );
};

export default CourseRegistrationForm;