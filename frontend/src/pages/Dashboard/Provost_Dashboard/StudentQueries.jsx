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
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          All Student Requests
        </h2>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Requests" },
            { key: "maintenance", label: "Maintenance" },
            { key: "leave", label: "Leave Requests" },
            { key: "feedback", label: "Feedback" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label} (
              {key === "all"
                ? allRequests.length
                : allRequests.filter((r) => r.type === key).length}
              )
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 && !loading && (
        <p className="text-gray-600 text-center py-10">
          No {filter === "all" ? "" : filter} requests found.
        </p>
      )}

      {filteredRequests.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo/Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request, index) => (
                <tr
                  key={`${request.type}-${request._id || index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.type === "maintenance"
                          ? "bg-orange-100 text-orange-800"
                          : request.type === "leave"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {request.typeLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.studentName}
                      </p>
                      <p className="text-gray-500">{request.studentEmail}</p>
                      {request.studentRoom !== "N/A" && (
                        <p className="text-gray-500">
                          Room: {request.studentRoom}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-xs">
                      <p className="truncate" title={request.details}>
                        {request.details}
                      </p>
                      {request.type === "maintenance" &&
                        request.requestType && (
                          <p className="text-xs text-gray-500 capitalize mt-1">
                            Category: {request.requestType}
                          </p>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.type === "maintenance" && request.photo ? (
                      <img
                        src={request.photo}
                        alt="Maintenance Request"
                        className="h-10 w-10 object-cover rounded cursor-pointer hover:opacity-75"
                        onClick={() => openImageModal(request.photo)}
                        title="Click to enlarge"
                      />
                    ) : request.type === "feedback" && request.subject ? (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {request.subject}
                      </span>
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(request.requestDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.status,
                        request.type
                      )}`}
                    >
                      {request.status ||
                        (request.type === "feedback" ? "Submitted" : "Pending")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-xl max-w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged maintenance request"
              className="max-w-full max-h-[80vh] rounded"
            />
            <button
              onClick={closeImageModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQueries;
