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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        View Student Profiles
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
        />
      </div>

      {loading && (
        <div className="text-center py-10">
          <FaSpinner className="animate-spin mx-auto text-3xl text-teal-600 mb-3" />
          <p className="text-gray-600 text-lg">Loading profiles...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredStudents.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No student profiles found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try a different search term or check back later.
          </p>
        </div>
      )}

      {!loading && !error && filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id} // Assuming student._id is unique
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              <div className="p-5 flex-grow">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mr-4 shrink-0">
                    <FaUser className="text-3xl text-teal-600" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-800 truncate"
                      title={student.studentProfileId?.name}
                    >
                      {student.studentProfileId?.name || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Roll: {student.studentProfileId?.rollNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <InfoItem
                    label="Email"
                    value={student.studentProfileId?.email || "N/A"}
                    isEmail
                  />
                  <InfoItem
                    label="Room"
                    value={student.allottedRoomNumber || "N/A"}
                  />
                  <InfoItem label="Floor" value={student.floor || "N/A"} />
                  <InfoItem
                    label="Course"
                    value={student.studentProfileId?.courseName || "N/A"}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 border-t border-gray-200">
                <button
                  onClick={() => handleViewFullProfile(student)}
                  className="w-full px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                >
                  View Full Profile
                </button>
                {/* Add other action buttons here if needed */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Full Profile */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto my-8 transform transition-all duration-300 ease-out scale-100 opacity-100">
            <div className="p-5 sm:p-7 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Student Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-teal-100 flex items-center justify-center mr-0 sm:mr-6 mb-4 sm:mb-0 shrink-0">
                  <FaUser className="text-5xl sm:text-6xl text-teal-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {selectedStudent.studentProfileId?.name || "N/A"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Roll Number:{" "}
                    {selectedStudent.studentProfileId?.rollNumber || "N/A"}
                  </p>
                </div>
              </div>

              <h5 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2">
                Contact Information
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailItem
                  label="Email Address"
                  value={selectedStudent.studentProfileId?.email || "N/A"}
                  icon={<FaEnvelope className="text-teal-600" />}
                />
                <DetailItem
                  label="Phone Number"
                  value={selectedStudent.studentProfileId?.phoneNumber || "N/A"}
                  icon={<FaPhone className="text-teal-600" />}
                />
              </div>

              <h5 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mt-5 mb-2">
                Academic Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailItem
                  label="Course"
                  value={selectedStudent.studentProfileId?.courseName || "N/A"}
                  icon={<FaGraduationCap className="text-teal-600" />}
                />
                <DetailItem
                  label="Department"
                  value={selectedStudent.studentProfileId?.department || "N/A"}
                  icon={<FaBuilding className="text-teal-600" />}
                />
              </div>

              <h5 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mt-5 mb-2">
                Hostel Information
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailItem
                  label="Hostel Name"
                  value={selectedStudent.hostelName || "N/A"}
                  icon={<FaBuilding className="text-teal-600" />}
                />
                <DetailItem
                  label="Room Number"
                  value={selectedStudent.allottedRoomNumber || "N/A"}
                  icon={<FaBed className="text-teal-600" />}
                />
                <DetailItem
                  label="Floor"
                  value={selectedStudent.floor || "N/A"}
                  icon={<FaBed className="text-teal-600" />}
                />
                <DetailItem
                  label="Allotment Date"
                  value={
                    selectedStudent.allotmentDate
                      ? new Date(
                          selectedStudent.allotmentDate
                        ).toLocaleDateString()
                      : "N/A"
                  }
                  icon={<FaBed className="text-teal-600" />}
                />
              </div>

              {/* Add more details as needed */}
            </div>

            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() =>
                  handleSendNotice(selectedStudent.studentProfileId?._id)
                }
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Notice
              </button>
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
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
