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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm w-full">
          <FaSpinner className="animate-spin mx-auto text-4xl text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
              <FaBell className="text-blue-600" />
              Student Notices
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Stay updated with important announcements and notices
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-center">
              <span className="font-semibold">{unreadCount}</span> unread notice
              {unreadCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {notices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
            <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              No Notices Yet
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              You'll see important notices and announcements here when they're
              available.
            </p>
          </div>
        ) : (
          <>
            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  onClick={() => handleNoticeClick(notice)}
                  className={`bg-white rounded-lg shadow-md border-l-4 p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    !notice.isRead
                      ? "border-l-blue-500 bg-blue-50/30"
                      : "border-l-gray-300"
                  }`}
                >
                  {/* Notice Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getNoticeIcon(notice.noticeType)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getNoticeTypeColor(
                          notice.noticeType
                        )}`}
                      >
                        {notice.noticeType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {notice.isUrgent && (
                        <FaExclamationTriangle className="text-yellow-500 text-sm" />
                      )}
                      {!notice.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Notice Content */}
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">
                    {notice.subject}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3">
                    {notice.message}
                  </p>

                  {/* Notice Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(notice.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye className="text-xs" />
                      View Details
                    </span>
                  </div>

                  {notice.actionRequired && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                      <strong>Action Required:</strong> {notice.actionRequired}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages}
                  <span className="hidden sm:inline">
                    {" "}
                    ({pagination.totalNotices} total notices)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadNotices(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded font-medium">
                    {pagination.currentPage}
                  </span>
                  <button
                    onClick={() => loadNotices(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Notice Detail Modal */}
        {modalOpen && selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getNoticeIcon(selectedNotice.noticeType)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getNoticeTypeColor(
                        selectedNotice.noticeType
                      )}`}
                    >
                      {selectedNotice.noticeType}
                    </span>
                    {selectedNotice.isUrgent && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <FaExclamationTriangle />
                        Urgent
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {selectedNotice.subject}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Notice Details
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedNotice.message}
                    </p>
                  </div>
                </div>

                {selectedNotice.actionRequired && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle />
                      Action Required
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      {selectedNotice.actionRequired}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Sent on</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedNotice.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  {selectedNotice.readAt && (
                    <div>
                      <p className="text-sm text-gray-500">Read on</p>
                      <p className="font-medium text-gray-800 flex items-center gap-2">
                        <FaCheck className="text-green-500 text-sm" />
                        {new Date(selectedNotice.readAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotices;
