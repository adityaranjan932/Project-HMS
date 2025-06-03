import React, { useState, useEffect } from "react";
import { apiConnector } from "../../../services/apiconnector"; // Adjust path if necessary
import {
  FaSpinner,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaBuilding,
  FaBed,
} from "react-icons/fa";

const ViewProfiles = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllottedStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await apiConnector(
          "GET",
          "/allotment/allotted-students", // Corrected API endpoint
          null,
          { Authorization: `Bearer ${token}` }
        );
        setAllStudents(response.data?.data || []); // Data from getAllAllottedStudents
        setFilteredStudents(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching allotted students:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch student profiles. Please ensure the API endpoint is correct and you are authorized."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllottedStudents();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(allStudents);
      return;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = allStudents.filter((student) => {
      // Updated to match the actual data structure from getAllAllottedStudents
      const nameMatch = student.studentProfileId?.name
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);
      const rollNumberMatch = student.studentProfileId?.rollNumber
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);
      return nameMatch || rollNumberMatch;
    });
    setFilteredStudents(filtered);
  }, [searchTerm, allStudents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // Updated functions for actions
  const handleViewFullProfile = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  // Add keyboard shortcut for closing modal
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape" && modalOpen) {
        handleCloseModal();
      }
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleKeyPress);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const handleSendNotice = (studentId) => {
    console.log("Send notice to student:", studentId);
    // Implement functionality to send a notice
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin mr-3 text-2xl text-blue-600" />
        <p className="text-lg text-gray-600">Loading student profiles...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 sm:p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-700">
            View Allotted Student Profiles
          </h2>
          <p className="text-gray-600 text-sm">
            Total Students:{" "}
            <span className="font-semibold">{allStudents.length}</span> |
            Showing:{" "}
            <span className="font-semibold">{filteredStudents.length}</span>
          </p>
        </div>
      </div>{" "}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name or roll number..."
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base pr-20"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2 py-1 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
          No students found matching your criteria or no students have been
          allotted a hostel yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-teal-600 truncate"
                  title={student.studentProfileId?.name || "N/A"}
                >
                  {student.studentProfileId?.name || "N/A"}
                </h3>
                <div className="space-y-1.5 text-xs sm:text-sm mb-3 sm:mb-4">
                  <InfoItem
                    label="Roll Number"
                    value={student.studentProfileId?.rollNumber || "N/A"}
                  />
                  <InfoItem
                    label="Course"
                    value={student.studentProfileId?.courseName || "N/A"}
                  />
                  <InfoItem
                    label="Semester"
                    value={student.studentProfileId?.semester || "N/A"}
                  />
                  <InfoItem
                    label="Email"
                    value={student.userId?.email || "N/A"}
                    isEmail
                  />
                  <InfoItem
                    label="SGPA"
                    value={
                      student.studentProfileId?.averageSgpa
                        ? student.studentProfileId.averageSgpa.toFixed(2)
                        : "N/A"
                    }
                  />
                  <hr className="my-2 sm:my-3" />
                  <InfoItem
                    label="Hostel"
                    value={student.allottedHostelType || "N/A"}
                  />
                  <InfoItem
                    label="Room No."
                    value={student.allottedRoomNumber || "N/A"}
                  />
                  <InfoItem
                    label="Bed"
                    value={student.allottedBedId || "N/A"}
                  />
                </div>
              </div>
              <div className="mt-auto pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => handleViewFullProfile(student)}
                  className="w-full flex-grow bg-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-teal-600 transition duration-300 text-xs sm:text-sm"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() =>
                    handleSendNotice(student.studentProfileId?._id)
                  }
                  className="w-full flex-grow bg-gray-200 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-gray-300 transition duration-300 text-xs sm:text-sm"
                >
                  Send Notice
                </button>
              </div>
            </div>
          ))}{" "}
        </div>
      )}
      {/* Full Profile Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaUser className="text-teal-600" />
                Student Profile Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUser className="text-teal-600" />
                      Personal Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <DetailItem
                        label="Full Name"
                        value={selectedStudent.studentProfileId?.name || "N/A"}
                      />
                      <DetailItem
                        label="Roll Number"
                        value={
                          selectedStudent.studentProfileId?.rollNumber || "N/A"
                        }
                      />
                      <DetailItem
                        label="Email"
                        value={selectedStudent.userId?.email || "N/A"}
                        icon={<FaEnvelope className="text-blue-500" />}
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-purple-600" />
                      Academic Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <DetailItem
                        label="Course"
                        value={
                          selectedStudent.studentProfileId?.courseName || "N/A"
                        }
                      />
                      <DetailItem
                        label="Semester"
                        value={
                          selectedStudent.studentProfileId?.semester || "N/A"
                        }
                      />
                      <DetailItem
                        label="SGPA (Odd)"
                        value={
                          selectedStudent.studentProfileId?.sgpaOdd
                            ? selectedStudent.studentProfileId.sgpaOdd.toFixed(
                                2
                              )
                            : "N/A"
                        }
                      />
                      <DetailItem
                        label="SGPA (Even)"
                        value={
                          selectedStudent.studentProfileId?.sgpaEven
                            ? selectedStudent.studentProfileId.sgpaEven.toFixed(
                                2
                              )
                            : "N/A"
                        }
                      />
                      <DetailItem
                        label="Average SGPA"
                        value={
                          selectedStudent.studentProfileId?.averageSgpa
                            ? selectedStudent.studentProfileId.averageSgpa.toFixed(
                                2
                              )
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Hostel Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaBuilding className="text-orange-600" />
                      Hostel Allotment
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <DetailItem
                        label="Hostel Type"
                        value={selectedStudent.allottedHostelType || "N/A"}
                        icon={<FaBuilding className="text-orange-500" />}
                      />
                      <DetailItem
                        label="Room Number"
                        value={selectedStudent.allottedRoomNumber || "N/A"}
                        icon={<FaBed className="text-green-500" />}
                      />
                      <DetailItem
                        label="Bed ID"
                        value={selectedStudent.allottedBedId || "N/A"}
                      />
                      <DetailItem
                        label="Room Preference"
                        value={
                          selectedStudent.studentProfileId?.roomPreference ||
                          "N/A"
                        }
                      />
                      <DetailItem
                        label="Allotment Date"
                        value={
                          selectedStudent.createdAt
                            ? new Date(
                                selectedStudent.createdAt
                              ).toLocaleDateString()
                            : "N/A"
                        }
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Additional Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <DetailItem
                        label="Student ID"
                        value={selectedStudent._id}
                      />
                      <DetailItem
                        label="Profile Status"
                        value="Allotted"
                        badge="success"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() =>
                    handleSendNotice(selectedStudent.studentProfileId?._id)
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Notice
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for consistent display of information items in cards
const InfoItem = ({ label, value, isEmail }) => (
  <div className="flex justify-between items-start gap-2">
    <p className="text-gray-500 whitespace-nowrap">{label}:</p>
    <p
      className={`font-medium text-gray-700 text-right ${
        isEmail ? "break-all" : "truncate"
      }`}
      title={value}
    >
      {value}
    </p>
  </div>
);

// Helper component for detailed modal information
const DetailItem = ({ label, value, icon, badge }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-gray-600 font-medium">{label}:</span>
    </div>
    <div className="text-right">
      {badge ? (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            badge === "success"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="font-semibold text-gray-800">{value}</span>
      )}
    </div>
  </div>
);

export default ViewProfiles;
