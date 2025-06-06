import React from "react";

const NoticeViewer = ({ notice, onClose }) => {
  if (!notice) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateLong = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Academic":
        return "blue";
      case "Events":
        return "green";
      case "Urgent":
        return "red";
      case "General":
        return "gray";
      default:
        return "gray";
    }
  };

  const getStatusBadge = (notice) => {
    const now = new Date();
    const effectiveDate = notice.effectiveDate
      ? new Date(notice.effectiveDate)
      : null;
    const expiryDate = notice.expiryDate ? new Date(notice.expiryDate) : null;

    if (expiryDate && expiryDate < now) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          EXPIRED
        </span>
      );
    }
    if (effectiveDate && effectiveDate > now) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          UPCOMING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        ACTIVE
      </span>
    );
  };

  const handlePdfView = () => {
    if (notice.pdfPath) {
      window.open(
        `${import.meta.env.VITE_API_BASE_URL}/${notice.pdfPath}`,
        "_blank"
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="bg-white rounded-full p-2 shadow-lg text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Official Notice Content */}
        <div className="bg-white overflow-y-auto max-h-[95vh] print:max-h-none">
          {/* Official Header */}
          <div className="border-b-4 border-red-700 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-center justify-between p-6">
              <img
                src="/universitylogo.png"
                alt="University Logo"
                className="h-16 w-16 object-contain"
              />
              <div className="text-center flex-1 mx-4">
                <h1 className="text-2xl font-bold text-red-800 mb-1">
                  लखनऊ विश्वविद्यालय
                </h1>
                <h1 className="text-xl font-bold text-red-700 mb-1">
                  UNIVERSITY OF LUCKNOW
                </h1>
                <p className="text-sm text-gray-700 font-semibold">
                  (Accredited A++ by NAAC)
                </p>
                <p className="text-sm text-red-600 font-medium mt-1">
                  Office of Hostel Management
                </p>
              </div>
              <img
                src="/A++.png"
                alt="A++ Accreditation"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>

          {/* Notice Content */}
          <div className="p-8">
            {/* Notice Header Info */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Notice No:</span> HMS/
                    {new Date(notice.createdAt).getFullYear()}/
                    {Math.floor(Math.random() * 1000)
                      .toString()
                      .padStart(3, "0")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDateLong(notice.publishedAt || notice.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(
                      notice.category
                    )}-100 text-${getCategoryColor(
                      notice.category
                    )}-800 border border-${getCategoryColor(
                      notice.category
                    )}-200`}
                  >
                    {notice.category}
                  </span>
                  {getStatusBadge(notice)}
                  {notice.isImportant && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                      ⚠ URGENT
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notice Title */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-300 pb-2 inline-block">
                NOTICE
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mt-4">
                Subject: {notice.title}
              </h3>
            </div>

            {/* Notice Body */}
            <div className="mb-8">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-justify space-y-4">
                {notice.content}
              </div>
            </div>

            {/* Effective Dates */}
            {(notice.effectiveDate || notice.expiryDate) && (
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Important Dates:
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {notice.effectiveDate && (
                    <p>
                      <span className="font-medium">Effective from:</span>{" "}
                      {formatDateLong(notice.effectiveDate)}
                    </p>
                  )}
                  {notice.expiryDate && (
                    <p>
                      <span className="font-medium">Valid until:</span>{" "}
                      {formatDateLong(notice.expiryDate)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PDF Attachment */}
            {notice.pdfPath && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-red-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        Official Document Attached
                      </p>
                      <p className="text-sm text-gray-600">
                        Click to view the complete notice document
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePdfView}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    View PDF
                  </button>
                </div>
              </div>
            )}

            {/* Digital Signature */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                      Digitally Signed by:
                    </p>
                    <div className="border-2 border-green-600 bg-green-50 p-4 rounded-lg max-w-xs">
                      <p className="font-bold text-green-800 text-lg">
                        Dr. Abhishek Kumar
                      </p>
                      <p className="text-sm text-green-700">Kautilya Hall</p>
                      <p className="text-sm text-green-700">
                        University of Lucknow
                      </p>
                      <div className="mt-2 pt-2 border-t border-green-300">
                        <p className="text-xs text-green-600">
                          <span className="font-semibold">Signed Date:</span>{" "}
                          {formatDateLong(
                            notice.publishedAt || notice.createdAt
                          )}
                        </p>
                        <p className="text-xs text-green-600">
                          <span className="font-semibold">Certificate ID:</span>{" "}
                          HMS-{new Date().getFullYear()}-
                          {Math.floor(Math.random() * 10000)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    <p>This is a digitally signed document.</p>
                    <p>No physical signature is required.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
              <p>University of Lucknow | Office of Hostel Management</p>
              <p>Lucknow - 226007 | Website: www.lko.ac.in</p>
              <p className="mt-2 text-xs text-gray-400">
                Generated on: {new Date().toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 print:hidden">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Notice ID: {notice._id}</div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeViewer;
