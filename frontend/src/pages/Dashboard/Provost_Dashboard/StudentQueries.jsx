import React, { useEffect, useState } from "react";
import { apiConnector } from "../../../services/apiconnector";

const StudentQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For modal

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
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
          `${SERVICE_REQUESTS_API}/all` // Changed to /all endpoint
        );
        setQueries(response.data);
      } catch (err) {
        console.error("Error fetching maintenance requests:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch maintenance requests. Please ensure you are authorized."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <p className="text-center py-10">Loading student queries...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-10">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Student Maintenance Requests
      </h2>

      {queries.length === 0 && !loading && (
        <p className="text-gray-600 text-center">
          No maintenance requests found.
        </p>
      )}

      {queries.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Request Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Photo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Submitted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queries.map((query) => (
                <tr
                  key={query._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {query.userId?.name || query.userId?.firstName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                    {query.requestType}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate"
                    title={query.description}
                  >
                    {query.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {query.photo ? (
                      <img
                        src={query.photo}
                        alt="Maintenance Request"
                        className="h-10 w-10 object-cover rounded cursor-pointer hover:opacity-75"
                        onClick={() => openImageModal(query.photo)}
                        title="Click to enlarge"
                      />
                    ) : (
                      "No photo"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(query.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        query.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : query.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : query.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800" // for rejected or other statuses
                      }`}
                    >
                      {query.status}
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
          onClick={closeImageModal} // Close modal on backdrop click
        >
          <div
            className="bg-white p-4 rounded-lg shadow-xl max-w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside image/modal content
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
