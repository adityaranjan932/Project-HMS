import React, { useState, useEffect } from "react";
import { getPublishedPublicNotices } from "../../services/auth";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPublishedNotices();
  }, []);
  const fetchPublishedNotices = async () => {
    console.log("NoticeBoard: Fetching published notices...");
    try {
      const result = await getPublishedPublicNotices({
        limit: showAll ? 20 : 5,
      });
      console.log("NoticeBoard: API result:", result);
      if (result.success) {
        console.log("NoticeBoard: Setting notices:", result.notices);
        setNotices(result.notices);
      } else {
        console.log("NoticeBoard: API call unsuccessful:", result);
      }
    } catch (error) {
      console.error("NoticeBoard: Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      fetchPublishedNotices();
    }
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleNoticeClick = (notice) => {
    if (notice.pdfPath) {
      // Open PDF in new tab
      const pdfUrl = `${import.meta.env.VITE_API_BASE_URL}/${notice.pdfPath}`;
      window.open(pdfUrl, "_blank");
    } else {
      // Show notice content in a modal or alert for now
      alert(`${notice.title}\n\n${notice.content}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-red-50 rounded-lg shadow-md border border-red-200 h-full">
        <h3 className="text-xl font-bold mb-3 text-red-800 border-b-2 border-red-700 pb-2">
          Notice Board
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 rounded-lg shadow-md border border-red-200 h-full">
      <h3 className="text-xl font-bold mb-3 text-red-800 border-b-2 border-red-700 pb-2">
        Notice Board
      </h3>

      {notices.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No notices available at the moment.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notices.slice(0, showAll ? notices.length : 4).map((notice) => (
            <li
              key={notice._id}
              className="text-sm text-gray-700 hover:text-red-700 cursor-pointer border-b border-red-100 pb-2"
              onClick={() => handleNoticeClick(notice)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {notice.isImportant && (
                    <span className="font-semibold text-red-600">
                      IMPORTANT:{" "}
                    </span>
                  )}
                  <span className="font-medium">{notice.title}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(notice.publishedAt || notice.createdAt)} •{" "}
                    {notice.category}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {truncateText(notice.content, 60)}
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {notice.pdfPath ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      PDF
                    </span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      VIEW
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}

          {notices.length > 4 && !showAll && (
            <li className="text-sm text-gray-500 text-center py-2">
              ... and {notices.length - 4} more notices
            </li>
          )}
        </ul>
      )}

      <button
        onClick={handleViewAll}
        className="mt-4 w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition-colors text-sm font-medium"
        disabled={notices.length === 0}
      >
        {showAll ? "Show Less" : "View All Notices"}
      </button>

      {notices.length > 0 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Showing {Math.min(showAll ? notices.length : 4, notices.length)} of{" "}
            {notices.length} notices
          </p>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
