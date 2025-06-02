import React, { useState, useEffect } from "react";
import { apiConnector } from "../../../services/apiconnector"; // Adjust path if necessary

const ViewProfiles = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setAllStudents(response.data?.data || []); // Assuming data is nested under a 'data' property
        setFilteredStudents(response.data?.data || []); // Assuming data is nested under a 'data' property
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
      // Ensure student.userId exists and has name/studentId before trying to access them
      const nameMatch = student.userId?.name
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);
      const studentIdMatch = student.userId?.studentId
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);
      return nameMatch || studentIdMatch;
    });
    setFilteredStudents(filtered);
  }, [searchTerm, allStudents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Placeholder functions for actions
  const handleViewFullProfile = (studentId) => {
    console.log("View full profile for student:", studentId);
    // Implement navigation or modal display for full profile
  };

  const handleSendNotice = (studentId) => {
    console.log("Send notice to student:", studentId);
    // Implement functionality to send a notice
  };

  if (loading) {
    return <div className="p-6 text-center">Loading student profiles...</div>;
  }

  if (error) {
    return <div className="p-4 sm:p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-700 text-center sm:text-left">
        View Allotted Student Profiles
      </h2>
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Optional: Add a search button if explicit trigger is needed */}
          {/* <button
            className="bg-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-teal-700 transition duration-300 w-full sm:w-auto text-sm sm:text-base"
          >
            Search
          </button> */}
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
                  title={student.userId?.name || "N/A"}
                >
                  {student.userId?.name || "N/A"}
                </h3>
                <div className="space-y-1.5 text-xs sm:text-sm mb-3 sm:mb-4">
                  <InfoItem
                    label="Student ID"
                    value={student.userId?.studentId || "N/A"}
                  />
                  <InfoItem
                    label="Program"
                    value={student.userId?.program || "N/A"}
                  />
                  <InfoItem
                    label="Year"
                    value={student.userId?.year || "N/A"}
                  />
                  <InfoItem
                    label="Email"
                    value={student.userId?.email || "N/A"}
                    isEmail // Add a prop to handle potential long emails
                  />
                  <InfoItem
                    label="Phone"
                    value={student.userId?.contactNumber || "N/A"}
                  />
                  <hr className="my-2 sm:my-3" />
                  <InfoItem
                    label="Hostel"
                    value={student.hostelId?.name || "N/A"}
                  />
                  <InfoItem
                    label="Room No."
                    value={student.roomId?.roomNumber || "N/A"}
                  />
                </div>
              </div>
              <div className="mt-auto pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => handleViewFullProfile(student.userId?._id)}
                  className="w-full flex-grow bg-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-teal-600 transition duration-300 text-xs sm:text-sm"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => handleSendNotice(student.userId?._id)}
                  className="w-full flex-grow bg-gray-200 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-gray-300 transition duration-300 text-xs sm:text-sm"
                >
                  Send Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper component for consistent display of information items
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

export default ViewProfiles;
