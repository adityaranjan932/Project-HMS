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
        const response = await fetch("/api/service-requests/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestType, description }),
      });
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
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Service Request</h2>

      {/* Form for submitting a new request */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Request Type</label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select type</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Describe your request..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* List of existing requests */}
      <h3 className="text-lg font-semibold mt-6 mb-2">My Requests</h3>
      {loading && !requests.length ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id} className="mb-2 p-2 border rounded">
              <p>
                <strong>Type:</strong> {request.requestType}
              </p>
              <p>
                <strong>Description:</strong> {request.description}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
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
