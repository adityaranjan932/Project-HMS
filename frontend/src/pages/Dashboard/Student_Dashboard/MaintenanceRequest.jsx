// components/MaintenanceRequest.js
import React, { useState, useEffect } from "react";

const MaintenanceRequest = () => {
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored after login
        const response = await fetch(
          "http://localhost:4000/api/service-requests/my",
          {
            // Updated URL
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/service-requests",
        {
          // Updated URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestType, description }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit request");
      const newRequest = await response.json();
      setRequests([newRequest, ...requests]); // Add new request to list
      setRequestType(""); // Reset form
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Request</h2>

      {/* Form for submitting a new request */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Request Type
          </label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select type</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
            placeholder="Describe your request..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

      {/* List of existing requests */}
      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        My Requests
      </h3>
      {loading && !requests.length ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request._id}
              className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="text-gray-700">
                <strong className="font-medium">Type:</strong>{" "}
                {request.requestType}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Description:</strong>{" "}
                {request.description}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Status:</strong>{" "}
                {request.status}
              </p>
              <p className="text-gray-700">
                <strong className="font-medium">Created At:</strong>{" "}
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaintenanceRequest;
