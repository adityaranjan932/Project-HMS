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
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Service Request
          </h2>

          {/* Form for submitting a new request */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm sm:text-base"
                required
              >
                <option value="">Select type</option>
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-y min-h-[100px] text-sm sm:text-base"
                  rows="4"
                  placeholder="Describe your request..."
                  required
                ></textarea>
                {!isCameraOpen && !photoDataUrl && (
                  <button
                    type="button"
                    onClick={startCamera}
                    title="Take Photo"
                    className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 shadow-md"
                  >
                    <FaCamera size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Camera and Photo Section */}
            <div className="space-y-4">
              {isCameraOpen && stream && (
                <div className="border p-4 rounded-lg bg-gray-50">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-md mb-3 max-h-60 sm:max-h-80 object-cover"
                  />
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {photoDataUrl && (
                <div className="border p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Captured Photo:</p>
                  <img
                    src={photoDataUrl}
                    alt="Captured"
                    className="w-full max-w-sm mx-auto rounded-md shadow-md"
                  />
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(null)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Remove Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoDataUrl(null);
                        startCamera();
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    >
                      <FaRedo className="mr-2" />
                      Retake Photo
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {cameraError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {/* Display existing requests */}
          {requests.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Your Previous Requests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                      {request.requestType}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {request.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          request.status === "pending"
                            ? "text-yellow-600"
                            : request.status === "completed"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {request.photo && (
                      <img
                        src={request.photo}
                        alt="Request"
                        className="mt-2 w-full h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default MaintenanceRequest;
