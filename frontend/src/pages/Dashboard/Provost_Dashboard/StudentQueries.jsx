import React, { useEffect, useState } from "react";
import { apiConnector } from "../../../services/apiconnector";
import { FaSpinner } from "react-icons/fa";

const StudentQueries = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all"); // Filter for request types

  useEffect(() => {
    const fetchAllRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all types of requests
        const [maintenanceRes, leaveRes, feedbackRes] = await Promise.all([
          apiConnector("GET", "/service-requests/all", null, headers),
          apiConnector("GET", "/leave/all", null, headers),
          apiConnector("GET", "/feedback/all", null, headers),
        ]);

        // Combine and format all requests
        const combinedRequests = [
          ...maintenanceRes.data.map((req) => ({
            ...req,
            type: "maintenance",
            typeLabel: "Maintenance",
            studentName: req.userId?.name || req.userId?.firstName || "N/A",
            studentEmail: req.userId?.email || "N/A",
            studentRoom: req.userId?.roomNumber || "N/A",
            requestDate: req.createdAt,
            details: req.description,
          })),
          ...leaveRes.data.map((req) => ({
            ...req,
            type: "leave",
            typeLabel: "Leave Request",
            studentName:
              req.studentId?.name || req.studentId?.firstName || "N/A",
            studentEmail: req.studentId?.email || "N/A",
            studentRoom: req.studentId?.roomNumber || "N/A",
            requestDate: req.createdAt,
            details: `${req.reason} (${new Date(
              req.fromDate
            ).toLocaleDateString()} - ${new Date(
              req.toDate
            ).toLocaleDateString()})`,
          })),
          ...feedbackRes.data.map((req) => ({
            ...req,
            type: "feedback",
            typeLabel: "Feedback",
            studentName: "Anonymous", // Feedback doesn't have user reference
            studentEmail: "N/A",
            studentRoom: "N/A",
            requestDate: req.createdAt,
            details: req.message,
            subject: req.subject,
          })),
        ];

        // Sort by creation date (newest first)
        combinedRequests.sort(
          (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
        );

        setAllRequests(combinedRequests);
      } catch (err) {
        console.error("Error fetching requests:", err);

        // More detailed error handling
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          setError(
            "Access denied. You don't have permission to view this data."
          );
        } else if (err.response?.status === 404) {
          setError("API endpoints not found. Please contact administrator.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch requests. Please ensure you are authorized."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, []);
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getFilteredRequests = () => {
    if (filter === "all") return allRequests;
    return allRequests.filter((req) => req.type === filter);
  };

  const getStatusColor = (status, type) => {
    if (type === "feedback") return "bg-blue-100 text-blue-800";

    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "completed":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin mr-3 text-2xl text-blue-600" />
        <p className="text-lg text-gray-600">Loading all student requests...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-10">{error}</p>;
  }

  const filteredRequests = getFilteredRequests();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Student Queries & Requests
      </h2>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <label
          htmlFor="requestFilter"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Filter by Request Type:
        </label>
        <select
          id="requestFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
        >
          <option value="all">All Requests</option>
          <option value="maintenance">Maintenance</option>
          <option value="leave">Leave Requests</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-10">
          <FaSpinner className="animate-spin mx-auto text-3xl text-teal-600 mb-3" />
          <p className="text-gray-600 text-lg">Loading requests...</p>
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

      {!loading && !error && filteredRequests.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No requests found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting the filter or check back later.
          </p>
        </div>
      )}

      {!loading && !error && filteredRequests.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div
                className={`p-5 border-l-4 ${getStatusColor(
                  req.status,
                  req.type
                )}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {req.typeLabel} - ID: {req._id.slice(-6)}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      req.status,
                      req.type,
                      true // isBadge
                    )}`}
                  >
                    {req.status
                      ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
                      : "Pending"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Student: </span>
                    <span className="text-gray-700 font-medium">
                      {req.studentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email: </span>
                    <span className="text-gray-700 font-medium break-all">
                      {req.studentEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Room: </span>
                    <span className="text-gray-700 font-medium">
                      {req.studentRoom}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date: </span>
                    <span className="text-gray-700 font-medium">
                      {new Date(req.requestDate).toLocaleString()}
                    </span>
                  </div>
                </div>

                {req.subject && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Subject:</span> {req.subject}
                  </p>
                )}
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <span className="font-medium">Details:</span> {req.details}
                </p>

                {req.type === "maintenance" && req.photoUrl && (
                  <div className="mt-3">
                    <button
                      onClick={() => openImageModal(req.photoUrl)}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center"
                    >
                      View Attached Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons could be added here if needed */}
              {/* Example: 
                <div className="bg-gray-50 p-3 sm:p-4 border-t border-gray-200 flex justify-end gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    Mark as Resolved
                  </button>
                </div>
              */}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full relative">
            <img
              src={selectedImage}
              alt="Maintenance Request Attachment"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
              aria-label="Close image modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQueries;
