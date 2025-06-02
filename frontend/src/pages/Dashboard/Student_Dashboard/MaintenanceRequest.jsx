// components/MaintenanceRequest.js
import React, { useState, useEffect, useRef } from "react";
import { apiConnector } from "../../../services/apiconnector";
import { FaCamera, FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";

const MaintenanceRequest = () => {
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Camera related state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Fetch existing requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await apiConnector(
          "GET",
          "/service-requests/my",
          null,
          { Authorization: `Bearer ${token}` }
        );
        const data = response.data;
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    setPhotoDataUrl(null); // Clear previous photo
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Could not access camera. Please ensure permissions are granted and no other app is using it."
      );
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const context = canvasElement.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        videoElement.videoWidth,
        videoElement.videoHeight
      );
      const dataUrl = canvasElement.toDataURL("image/jpeg");
      setPhotoDataUrl(dataUrl);
      stopCamera();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem("token");
      const payload = { requestType, description };
      if (photoDataUrl) {
        payload.photo = photoDataUrl; 
      }
      const response = await apiConnector(
        "POST",
        "/service-requests",
        payload, 
        { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      );
      const newRequest = response.data;
      setRequests([newRequest, ...requests]);
      setRequestType("");
      setDescription("");
      setPhotoDataUrl(null); 
      setCameraError(null);
    } catch (err) {
      setError(err.message || "Failed to submit request. Please try again.");
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
            required
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
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" // Added pr-16 and resize-none
              rows="4"
              placeholder="Describe your request..."
              required
            ></textarea>
            {!isCameraOpen && !photoDataUrl && (
              <button
                type="button"
                onClick={startCamera}
                title="Take Photo"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                // Removed mx-auto, changed w-12 h-12 to w-10 h-10 for a slightly smaller button to fit better
              >
                <FaCamera size={18} /> 
              </button>
            )}
          </div>
        </div>

        {/* Camera and Photo Section - This part remains below the description field */}
        <div className="space-y-4 mt-4"> 
          {/* Added mt-4 to give some space if camera/preview opens directly after description */}
          {isCameraOpen && stream && (
            <div className="border p-4 rounded-lg bg-gray-50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-md mb-3"
                style={{ maxHeight: "300px" }}
              />
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  title="Capture Photo"
                  className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
                >
                  <FaCheckCircle size={20} />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  title="Cancel Camera"
                  className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
            </div>
          )}

          {cameraError && (
            <p className="text-red-500 text-sm mt-1 text-center">{cameraError}</p>
          )}

          {photoDataUrl && (
            <div className="mt-4 border p-4 rounded-lg bg-gray-50 flex flex-col items-center">
              <p className="font-medium text-gray-700 mb-2">Photo Preview:</p>
              <img
                src={photoDataUrl}
                alt="Captured preview"
                className="max-w-full h-auto rounded-md border border-gray-300"
                style={{ maxHeight: "300px" }}
              />
              <button
                type="button"
                onClick={startCamera} // Re-opens camera, clearing current photo
                title="Retake Photo"
                className="mt-3 flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300"
              >
                <FaRedo size={18} />
              </button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
        {/* End Camera and Photo Section */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={loading || isCameraOpen} // Disable submit if camera is open
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Error message for submission */}
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
