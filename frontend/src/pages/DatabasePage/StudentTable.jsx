import React, { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiconnector";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await apiConnector("GET", "/auth/registered-students");

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError("Failed to fetch student data");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleExpandStudent = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  // Function to download JSON data
  const downloadJSON = () => {
    // Map the students data to include only the specified fields
    const dataToDownload = students.map((student) => ({
      Name: student.name,
      FatherName: student.fatherName,
      MotherName: student.motherName,
      RollNo: student.rollNumber,
      Gender: student.gender,
      Course: student.courseName,
      Semester: student.semester,
      RoomPreference: student.roomPreference,
      ContactNumber: student.contactNumber,
      AdmissionYear: student.admissionYear,
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToDownload, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "student_profiles.json";
    link.click();
  };

  if (loading)
    return (
      <div className="text-center py-8 text-lg">Loading student data...</div>
    );
  if (error)
    return <div className="text-center py-8 text-lg text-red-600">{error}</div>;

  return (
    <>
      {" "}
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-6 font-sans">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Student Profiles
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Registered students database with detailed information
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="text-sm sm:text-base text-gray-700 bg-blue-50 px-4 py-2 rounded-md">
            <span className="font-semibold text-blue-800">
              {students.length}
            </span>{" "}
            students registered
          </div>
          <button
            onClick={downloadJSON}
            className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 sm:px-6 rounded-md transition-all duration-200 text-sm sm:text-base font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download JSON
            </span>
          </button>
        </div>{" "}
        {/* Desktop Table View */}
        <div className="hidden xl:block overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Roll Number
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Semester
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  SGPA (Odd)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  SGPA (Even)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Room Pref.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <React.Fragment key={student._id}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.semester}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.sgpaOdd}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.sgpaEven}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {student.roomPreference}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200 text-sm font-medium"
                        onClick={() => toggleExpandStudent(student._id)}
                      >
                        {expandedStudent === student._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedStudent === student._id && (
                    <tr className="bg-blue-50">
                      <td colSpan="9" className="px-4 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          <div className="space-y-3">
                            <h3 className="font-bold text-blue-800 text-base border-b border-blue-200 pb-2">
                              Personal Information
                            </h3>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium text-gray-700">
                                  Father's Name:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.fatherName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Mother's Name:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.motherName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Gender:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.gender}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Contact:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.contactNumber}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-bold text-blue-800 text-base border-b border-blue-200 pb-2">
                              Academic Information
                            </h3>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium text-gray-700">
                                  Course:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.courseName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Department:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.department}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Admission Year:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.admissionYear}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Semester:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.semester}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  SGPA (Odd):
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.sgpaOdd}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  SGPA (Even):
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.sgpaEven}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-bold text-blue-800 text-base border-b border-blue-200 pb-2">
                              Hostel Information
                            </h3>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium text-gray-700">
                                  Room Preference:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.roomPreference}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Room Number:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.roomNumber || "Not Assigned"}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Eligibility:
                                </span>{" "}
                                <span
                                  className={`font-medium ${
                                    student.isEligible
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {student.isEligible
                                    ? "Eligible"
                                    : "Not Eligible"}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  User ID:
                                </span>{" "}
                                <span className="text-gray-900 font-mono text-xs">
                                  {student.userId}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Student ID:
                                </span>{" "}
                                <span className="text-gray-900 font-mono text-xs">
                                  {student._id}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Tablet Table View */}
        <div className="hidden md:block xl:hidden overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Roll Number
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Room Pref.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <React.Fragment key={student._id}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {student.roomPreference}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200 text-sm font-medium"
                        onClick={() => toggleExpandStudent(student._id)}
                      >
                        {expandedStudent === student._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedStudent === student._id && (
                    <tr className="bg-blue-50">
                      <td colSpan="5" className="px-4 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <h3 className="font-bold text-blue-800 text-base border-b border-blue-200 pb-2">
                              Personal & Academic
                            </h3>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium text-gray-700">
                                  Father's Name:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.fatherName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Mother's Name:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.motherName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Gender:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.gender}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Contact:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.contactNumber}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Course:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.courseName}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Semester:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.semester}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Admission Year:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.admissionYear}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-bold text-blue-800 text-base border-b border-blue-200 pb-2">
                              Performance & Hostel
                            </h3>
                            <div className="space-y-2">
                              <p>
                                <span className="font-medium text-gray-700">
                                  SGPA (Odd):
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.sgpaOdd}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  SGPA (Even):
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.sgpaEven}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Room Preference:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.roomPreference}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Room Number:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {student.roomNumber || "Not Assigned"}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">
                                  Eligibility:
                                </span>{" "}
                                <span
                                  className={`font-medium ${
                                    student.isEligible
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {student.isEligible
                                    ? "Eligible"
                                    : "Not Eligible"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {students.map((student, index) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.isEligible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.isEligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <p className="font-medium text-gray-900">
                      {student.department}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Semester:</span>
                    <p className="font-medium text-gray-900">
                      {student.semester}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Room Pref:</span>
                    <p className="font-medium text-gray-900 capitalize">
                      {student.roomPreference}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <p className="font-medium text-gray-900">
                      {student.contactNumber}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200 text-sm font-medium"
                  onClick={() => toggleExpandStudent(student._id)}
                >
                  {expandedStudent === student._id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                {expandedStudent === student._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Personal Information
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">
                              Father's Name:
                            </span>{" "}
                            <span className="text-gray-900">
                              {student.fatherName}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">
                              Mother's Name:
                            </span>{" "}
                            <span className="text-gray-900">
                              {student.motherName}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Gender:</span>{" "}
                            <span className="text-gray-900">
                              {student.gender}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Academic Details
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">Course:</span>{" "}
                            <span className="text-gray-900">
                              {student.courseName}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">
                              Admission Year:
                            </span>{" "}
                            <span className="text-gray-900">
                              {student.admissionYear}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">SGPA (Odd):</span>{" "}
                            <span className="text-gray-900">
                              {student.sgpaOdd}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">SGPA (Even):</span>{" "}
                            <span className="text-gray-900">
                              {student.sgpaEven}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Hostel Information
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-gray-600">Room Number:</span>{" "}
                            <span className="text-gray-900">
                              {student.roomNumber || "Not Assigned"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>{" "}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2">
          <div className="text-gray-700 font-medium text-sm sm:text-base">
            <p>
              Total Students:{" "}
              <span className="text-blue-600 font-bold">{students.length}</span>
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentTable;
