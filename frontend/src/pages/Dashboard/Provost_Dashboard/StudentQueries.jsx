import React, { useEffect, useState, useRef } from "react";
import { apiConnector } from "../../../services/apiconnector";
import {
  FaSpinner,
  FaFilter,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaTools,
  FaCalendarAlt,
  FaComments,
  FaUser,
  FaEnvelope,
  FaBed,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaDownload,
  FaChevronDown,
  FaBell,
  FaClipboardList,
  FaGraduationCap,
  FaSortAmountDown,
  FaFlag,
  FaStar,
  FaSort,
  FaTh,
  FaList,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaCogs,
  FaHandshake,
  FaHistory,
  FaFileAlt,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
  FaUserCheck,
  FaHashtag,
  FaCamera,
  FaRedo,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const StudentQueries = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    maintenance: 0,
    leave: 0,
    feedback: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [resolvingRequest, setResolvingRequest] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveData, setResolveData] = useState({
    status: "",
    response: "",
    resolution: "",
    provostComments: "",
  });

  // Camera related state for completion photos
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [completionPhotoDataUrl, setCompletionPhotoDataUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  useEffect(() => {
    fetchAllRequests();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [allRequests]);

  const fetchAllRequests = async (showToast = false) => {
    if (showToast) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        toast.error("Authentication required");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all types of requests
      const [maintenanceRes, leaveRes, feedbackRes] = await Promise.all([
        apiConnector("GET", "/service-requests/all", null, headers),
        apiConnector("GET", "/leave/all", null, headers),
        apiConnector("GET", "/feedback/all", null, headers),
      ]); // Combine and format all requests
      const combinedRequests = [
        ...(maintenanceRes.data.success
          ? maintenanceRes.data.data
          : maintenanceRes.data || []
        ).map((req) => ({
          ...req,
          type: "maintenance",
          typeLabel: "Maintenance",
          studentName: req.userId?.name || "N/A",
          studentEmail: req.userId?.email || "N/A",
          studentRoom: req.userId?.studentProfile?.roomNumber || "N/A",
          requestDate: req.createdAt,
          details: req.description,
        })),
        ...(leaveRes.data.success
          ? leaveRes.data.data
          : leaveRes.data || []
        ).map((req) => ({
          ...req,
          type: "leave",
          typeLabel: "Leave Request",
          studentName: req.studentId?.name || "N/A",
          studentEmail: req.studentId?.email || "N/A",
          studentRoom: req.studentId?.studentProfile?.roomNumber || "N/A",
          requestDate: req.createdAt,
          details: `${req.reason} (${new Date(
            req.fromDate
          ).toLocaleDateString()} - ${new Date(
            req.toDate
          ).toLocaleDateString()})`,
        })),
        ...(feedbackRes.data.success
          ? feedbackRes.data.data
          : feedbackRes.data || []
        ).map((req) => ({
          ...req,
          type: "feedback",
          typeLabel: "Feedback",
          studentName: req.userId?.name || "Anonymous",
          studentEmail: req.userId?.email || "N/A",
          studentRoom: req.userId?.studentProfile?.rollNumber || "N/A",
          requestDate: req.createdAt,
          details: req.message,
          subject: req.subject || req.feedbackType,
        })),
      ];

      // Sort by creation date (newest first)
      combinedRequests.sort(
        (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
      );
      setAllRequests(combinedRequests);
      if (showToast) {
        toast.success("Requests refreshed successfully");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);

      // More detailed error handling
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        toast.error("Authentication failed");
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to view this data.");
        toast.error("Access denied");
      } else if (err.response?.status === 404) {
        setError("API endpoints not found. Please contact administrator.");
        toast.error("API endpoints not found");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch requests. Please ensure you are authorized."
        );
        toast.error("Failed to fetch requests");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = () => {
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter(
        (req) => req.status === "pending" || !req.status
      ).length,
      resolved: allRequests.filter(
        (req) =>
          req.status === "resolved" ||
          req.status === "completed" ||
          req.status === "approved"
      ).length,
      maintenance: allRequests.filter((req) => req.type === "maintenance")
        .length,
      leave: allRequests.filter((req) => req.type === "leave").length,
      feedback: allRequests.filter((req) => req.type === "feedback").length,
    };
    setStats(stats);
  };
  const handleRefresh = () => {
    fetchAllRequests(true);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Resolve request functionality
  const openResolveModal = (request) => {
    setResolvingRequest(request);

    // Set default status based on request type
    let defaultStatus = "";
    if (request.type === "maintenance") {
      defaultStatus = "completed";
    } else if (request.type === "leave") {
      defaultStatus = "approved";
    } else if (request.type === "feedback") {
      defaultStatus = "resolved";
    }

    setResolveData({
      status: defaultStatus,
      response: "",
      resolution: "",
      provostComments: "",
    });
    setShowResolveModal(true);
  };
  const closeResolveModal = () => {
    setShowResolveModal(false);
    setResolvingRequest(null);
    setResolveData({
      status: "",
      response: "",
      resolution: "",
      provostComments: "",
    });
    setCompletionPhotoDataUrl(null);
    setCameraError(null);
    stopCamera();
  };
  // Camera functions for completion photos
  const startCamera = async () => {
    setCameraError(null);
    setCompletionPhotoDataUrl(null);
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera is not supported on this device or browser");
      } // Try different camera configurations for better compatibility
      let mediaStream;
      try {
        // First try with preferred settings
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment", // Use back camera if available
          },
        });
      } catch (err) {
        // Fallback to basic video constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      }
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Could not access camera. ";

      if (err.name === "NotFoundError" || err.name === "DeviceNotFoundError") {
        errorMessage += "No camera device found on this device.";
      } else if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotSupportedError") {
        errorMessage += "Camera is not supported on this browser.";
      } else if (err.name === "NotReadableError") {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage +=
          err.message || "Please check your camera settings and try again.";
      }

      setCameraError(errorMessage);
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
      setCompletionPhotoDataUrl(dataUrl);
      stopCamera();
    }
  };

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

  const handleResolveRequest = async (e) => {
    e.preventDefault();

    if (!resolvingRequest || !resolveData.status) {
      toast.error("Please select a status");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      let endpoint = "";
      let requestBody = { status: resolveData.status }; // Determine endpoint and request body based on request type
      if (resolvingRequest.type === "maintenance") {
        endpoint = `/service-requests/resolve/${resolvingRequest._id}`;
        if (resolveData.resolution) {
          requestBody.resolution = resolveData.resolution;
        }
        // Add completion photo if status is completed
        if (resolveData.status === "completed" && completionPhotoDataUrl) {
          requestBody.completionPhoto = completionPhotoDataUrl;
        }
      } else if (resolvingRequest.type === "leave") {
        endpoint = `/leave/resolve/${resolvingRequest._id}`;
        if (resolveData.provostComments) {
          requestBody.provostComments = resolveData.provostComments;
        }
      } else if (resolvingRequest.type === "feedback") {
        endpoint = `/feedback/resolve/${resolvingRequest._id}`;
        if (resolveData.response) {
          requestBody.response = resolveData.response;
        }
      }

      const response = await apiConnector(
        "PUT",
        endpoint,
        requestBody,
        headers
      );

      if (response.data.success) {
        toast.success(response.data.message || "Request resolved successfully");
        closeResolveModal();
        fetchAllRequests(true); // Refresh the data
      } else {
        toast.error(response.data.error || "Failed to resolve request");
      }
    } catch (error) {
      console.error("Error resolving request:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to resolve request"
      );
    }
  };

  const getFilteredRequests = () => {
    let filtered = allRequests;

    // Filter by type
    if (filter !== "all") {
      filtered = filtered.filter((req) => req.type === filter);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((req) => {
        const status = req.status || "pending";
        if (selectedStatus === "pending") {
          return status === "pending" || !req.status;
        } else if (selectedStatus === "resolved") {
          return (
            status === "resolved" ||
            status === "completed" ||
            status === "approved"
          );
        }
        return status === selectedStatus;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (req.subject &&
            req.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      if (dateRange !== "all") {
        filtered = filtered.filter(
          (req) => new Date(req.requestDate) >= filterDate
        );
      }
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status || "pending";
          bValue = b.status || "pending";
          break;
        case "student":
          aValue = a.studentName.toLowerCase();
          bValue = b.studentName.toLowerCase();
          break;
        default:
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getPaginatedRequests = () => {
    const filtered = getFilteredRequests();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filtered = getFilteredRequests();
    return Math.ceil(filtered.length / itemsPerPage);
  };
  const getStatusColor = (status, type, isBadge = false) => {
    if (type === "feedback") {
      return isBadge
        ? "bg-blue-100 text-blue-800 border border-blue-200"
        : "border-blue-400";
    }

    const statusLower = (status || "pending").toLowerCase();

    switch (statusLower) {
      case "pending":
        return isBadge
          ? "bg-amber-100 text-amber-800 border border-amber-200"
          : "border-amber-400";
      case "approved":
      case "completed":
      case "resolved":
        return isBadge
          ? "bg-green-100 text-green-800 border border-green-200"
          : "border-green-400";
      case "in-progress":
        return isBadge
          ? "bg-blue-100 text-blue-800 border border-blue-200"
          : "border-blue-400";
      case "rejected":
        return isBadge
          ? "bg-red-100 text-red-800 border border-red-200"
          : "border-red-400";
      default:
        return isBadge
          ? "bg-gray-100 text-gray-800 border border-gray-200"
          : "border-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "maintenance":
        return <FaTools className="text-orange-500" />;
      case "leave":
        return <FaCalendarAlt className="text-blue-500" />;
      case "feedback":
        return <FaComments className="text-green-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || "pending").toLowerCase();
    switch (statusLower) {
      case "pending":
        return <FaClock className="text-amber-500" />;
      case "approved":
      case "completed":
      case "resolved":
        return <FaCheckCircle className="text-green-500" />;
      case "in-progress":
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Student Queries
            </h3>
            <p className="text-gray-600">
              Fetching all student requests and feedback...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  const paginatedRequests = getPaginatedRequests();
  const totalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Student Queries & Requests
              </h1>
              <p className="text-blue-100 text-lg">
                Manage and track all student requests, feedback, and maintenance
                issues
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSync
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <FaClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <FaClock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.resolved}
                </p>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.maintenance}
                </p>
              </div>
              <FaTools className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.leave}
                </p>
              </div>
              <FaCalendarAlt className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feedback</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.feedback}
                </p>
              </div>
              <FaComments className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:mb-0">
              Search & Filter Requests
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <FaFilter className="w-4 h-4" />
                <span>{showFilters ? "Hide" : "Show"} Filters</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaTh className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name, email, request ID, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="leave">Leave Requests</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="in-progress">In Progress</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="type">Type</option>
                    <option value="status">Status</option>
                    <option value="student">Student</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {paginatedRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComments className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Requests Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ||
              filter !== "all" ||
              selectedStatus !== "all" ||
              dateRange !== "all"
                ? "Try adjusting your search criteria or filters"
                : "No student requests have been submitted yet"}
            </p>
            {(searchTerm ||
              filter !== "all" ||
              selectedStatus !== "all" ||
              dateRange !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                  setSelectedStatus("all");
                  setDateRange("all");
                  setCurrentPage(1);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      getFilteredRequests().length
                    )}{" "}
                    of {getFilteredRequests().length} requests
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Page:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {Array.from({ length: totalPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
              </div>
            </div>

            {/* Request Cards */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {" "}
              {paginatedRequests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  viewMode={viewMode}
                  onImageClick={openImageModal}
                  getStatusColor={getStatusColor}
                  getTypeIcon={getTypeIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  onResolve={openResolveModal}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span>Next</span>
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>{" "}
      {/* Enhanced Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Request Attachment
              </h3>
              <button
                onClick={closeImageModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Request Attachment"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
      {/* Resolve Request Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {" "}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Resolve {resolvingRequest?.typeLabel}
              </h3>
              <div className="mt-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Student:</span>{" "}
                  {resolvingRequest?.studentName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Request ID:</span> #
                  {resolvingRequest?._id.slice(-8)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Details:</span>{" "}
                  {resolvingRequest?.details}
                </p>
              </div>
              <form onSubmit={handleResolveRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={resolveData.status}
                    onChange={(e) =>
                      setResolveData({ ...resolveData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Status</option>
                    {resolvingRequest?.type === "maintenance" && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </>
                    )}
                    {resolvingRequest?.type === "leave" && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </>
                    )}
                    {resolvingRequest?.type === "feedback" && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Additional fields for resolution details */}
                {resolvingRequest?.type === "maintenance" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution
                    </label>
                    <textarea
                      value={resolveData.resolution}
                      onChange={(e) =>
                        setResolveData({
                          ...resolveData,
                          resolution: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter resolution details"
                    ></textarea>
                  </div>
                )}

                {resolvingRequest?.type === "leave" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provost Comments
                    </label>
                    <textarea
                      value={resolveData.provostComments}
                      onChange={(e) =>
                        setResolveData({
                          ...resolveData,
                          provostComments: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter comments for the student"
                    ></textarea>
                  </div>
                )}

                {resolvingRequest?.type === "feedback" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response
                    </label>
                    <textarea
                      value={resolveData.response}
                      onChange={(e) =>
                        setResolveData({
                          ...resolveData,
                          response: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter your response to the feedback"
                    ></textarea>
                  </div>
                )}

                {/* Camera and Photo Section for Maintenance Completion */}
                {resolvingRequest?.type === "maintenance" &&
                  resolveData.status === "completed" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Photo (Optional)
                      </label>
                      <p className="text-sm text-gray-600 mb-3">
                        Take a photo to document the completed maintenance work
                      </p>

                      <div className="space-y-4">
                        {isCameraOpen && stream && (
                          <div className="border-2 border-dashed border-green-300 p-4 rounded-lg bg-green-50">
                            <h4 className="text-md font-medium text-gray-800 mb-3 text-center">
                              Take Completion Photo
                            </h4>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full rounded-lg mb-4 max-h-64 object-cover shadow-md"
                            />
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                              <button
                                type="button"
                                onClick={capturePhoto}
                                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
                              >
                                <FaCheckCircle className="mr-2" />
                                Capture Photo
                              </button>
                              <button
                                type="button"
                                onClick={stopCamera}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                              >
                                <FaTimesCircle className="mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {completionPhotoDataUrl && (
                          <div className="border-2 border-dashed border-green-300 p-4 rounded-lg bg-green-50">
                            <h4 className="text-md font-medium text-gray-800 mb-3 text-center">
                              Completion Photo Captured
                            </h4>
                            <img
                              src={completionPhotoDataUrl}
                              alt="Maintenance completion proof"
                              className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4"
                            />
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setCompletionPhotoDataUrl(null)}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                              >
                                <FaTimesCircle className="mr-2" />
                                Remove Photo
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCompletionPhotoDataUrl(null);
                                  startCamera();
                                }}
                                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                              >
                                <FaRedo className="mr-2" />
                                Retake Photo
                              </button>
                            </div>
                          </div>
                        )}

                        {!isCameraOpen && !completionPhotoDataUrl && (
                          <button
                            type="button"
                            onClick={startCamera}
                            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200"
                          >
                            <FaCamera className="mr-2 text-gray-500" />
                            <span className="text-gray-600">
                              Take Completion Photo
                            </span>
                          </button>
                        )}

                        {cameraError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                              <FaExclamationTriangle className="w-5 h-5 mr-3" />
                              {cameraError}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeResolveModal}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!resolveData.status}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      resolveData.status
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FaCheck className="w-4 h-4" />
                    <span>Resolve Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>{" "}
        </div>
      )}
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

// RequestCard Component
const RequestCard = ({
  request,
  viewMode,
  onImageClick,
  getStatusColor,
  getTypeIcon,
  getStatusIcon,
  formatDate,
  onResolve,
}) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div
          className={`p-6 border-l-4 ${getStatusColor(
            request.status,
            request.type
          )}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getTypeIcon(request.type)}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {request.typeLabel}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {request._id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(request.status)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  request.status,
                  request.type,
                  true
                )}`}
              >
                {request.status
                  ? request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)
                  : "Pending"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Student:</span>
              <span className="text-sm font-medium text-gray-900">
                {request.studentName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium text-gray-900 truncate">
                {request.studentEmail}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBed className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Room:</span>
              <span className="text-sm font-medium text-gray-900">
                {request.studentRoom}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaRegCalendarAlt className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Submitted:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(request.requestDate)}
              </span>
            </div>
          </div>
          {request.subject && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">
                Subject:{" "}
              </span>
              <span className="text-sm text-gray-600">{request.subject}</span>
            </div>
          )}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Details: </span>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {request.details}
            </p>
          </div>{" "}
          {request.type === "maintenance" && request.photoUrl && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">
                Attachment available
              </span>
              <button
                onClick={() => onImageClick(request.photoUrl)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                <FaImage className="w-4 h-4" />
                <span>View Photo</span>
              </button>
            </div>
          )}
          {/* Resolve Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
            <button
              onClick={() => onResolve(request)}
              disabled={
                request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FaCheck className="w-4 h-4" />
              <span>
                {request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
                  ? "Resolved"
                  : "Resolve"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div
        className={`h-2 ${getStatusColor(request.status, request.type).replace(
          "border-",
          "bg-"
        )}`}
      ></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{getTypeIcon(request.type)}</div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {request.typeLabel}
              </h3>
              <p className="text-xs text-gray-500">#{request._id.slice(-6)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(request.status)}
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {request.studentName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBed className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Room {request.studentRoom}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRegCalendarAlt className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatDate(request.requestDate)}
            </span>
          </div>
        </div>
        {request.subject && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {request.subject}
            </p>
          </div>
        )}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Details:</p>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {request.details}
          </p>
        </div>{" "}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              request.status,
              request.type,
              true
            )}`}
          >
            {request.status
              ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
              : "Pending"}
          </span>

          <div className="flex items-center space-x-2">
            {request.type === "maintenance" && request.photoUrl && (
              <button
                onClick={() => onImageClick(request.photoUrl)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors duration-200"
              >
                <FaImage className="w-3 h-3" />
                <span>Photo</span>
              </button>
            )}

            <button
              onClick={() => onResolve(request)}
              disabled={
                request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
              }
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 flex items-center space-x-1 ${
                request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FaCheck className="w-3 h-3" />
              <span>
                {request.status === "completed" ||
                request.status === "resolved" ||
                request.status === "approved"
                  ? "Resolved"
                  : "Resolve"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQueries;
