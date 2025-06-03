import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaEye,
  FaCheck,
  FaTimes,
  FaBell,
} from "react-icons/fa";
import { getReceivedNotices, markNoticeAsRead } from "../../../services/auth";
import { toast } from "react-hot-toast";

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotices: 0,
  });

  useEffect(() => {
    loadNotices();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape" && modalOpen) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  const loadNotices = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getReceivedNotices(page, 20);
      if (response?.success) {
        setNotices(response.data || []);
        setPagination(
          response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalNotices: 0,
          }
        );
      } else {
        toast.error("Failed to load notices");
      }
    } catch (error) {
      console.error("Error loading notices:", error);
      toast.error("Error loading notices");
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = async (notice) => {
    setSelectedNotice(notice);
    setModalOpen(true);

    // Mark as read if not already read
    if (!notice.isRead) {
      try {
        const response = await markNoticeAsRead(notice._id);
        if (response?.success) {
          // Update the notice in the list
          setNotices((prev) =>
            prev.map((n) =>
              n._id === notice._id
                ? { ...n, isRead: true, readAt: new Date() }
                : n
            )
          );
        }
      } catch (error) {
        console.error("Error marking notice as read:", error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotice(null);
  };

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case "Behavioral Warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Academic Warning":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Disciplinary Action":
        return "bg-red-100 text-red-800 border-red-200";
      case "General Notice":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case "Behavioral Warning":
      case "Academic Warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "Disciplinary Action":
        return <FaTimes className="text-red-500" />;
      case "General Notice":
        return <FaBell className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const unreadCount = notices.filter((notice) => !notice.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin mr-3 text-2xl text-blue-600" />
        <p className="text-lg text-gray-600">Loading your notices...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Notices</h2>
          <p className="text-gray-600 mt-1">
            {notices.length} notice{notices.length !== 1 ? "s" : ""} total
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-16">
          <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No notices yet
          </h3>
          <p className="text-gray-500">
            You'll see notices from your provost here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              onClick={() => handleNoticeClick(notice)}
              className={`bg-white border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                !notice.isRead
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-grow">
                  <div className="mt-1">{getNoticeIcon(notice.noticeType)}</div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getNoticeTypeColor(
                          notice.noticeType
                        )}`}
                      >
                        {notice.noticeType}
                      </span>
                      <div className="flex items-center space-x-2">
                        {notice.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Urgent
                          </span>
                        )}
                        {!notice.isRead && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {notice.subject}
                    </h3>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {notice.message}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-medium">From:</span>{" "}
                        {notice.senderId?.name || "N/A"}
                      </div>
                      <div>
                        {new Date(notice.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <FaEye className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Detail Modal */}
      {modalOpen && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getNoticeIcon(selectedNotice.noticeType)}
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getNoticeTypeColor(
                        selectedNotice.noticeType
                      )}`}
                    >
                      {selectedNotice.noticeType}
                    </span>
                    {selectedNotice.isUrgent && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedNotice.subject}
                  </h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">From:</span>{" "}
                      {selectedNotice.senderId?.name} (
                      {selectedNotice.senderId?.role})
                    </p>
                    <p>
                      <span className="font-medium">Sent:</span>{" "}
                      {new Date(selectedNotice.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    {selectedNotice.isRead && (
                      <p>
                        <span className="font-medium">Read:</span>{" "}
                        {new Date(selectedNotice.readAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Notice Details
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedNotice.message}
                    </p>
                  </div>
                </div>

                {selectedNotice.actionRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <FaExclamationTriangle className="mr-2" />
                      Action Required
                    </h4>
                    <p className="text-yellow-700">
                      {selectedNotice.actionRequired}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotices;
