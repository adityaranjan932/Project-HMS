import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  createPublicNotice,
  getAllPublicNotices,
  updatePublicNotice,
  deletePublicNotice,
  publishPublicNotice,
} from "../../../services/auth";

const PublicNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    effectiveDate: "",
    expiryDate: "",
    isImportant: false,
    status: "draft",
  });
  const [attachments, setAttachments] = useState([]);
  const [filter, setFilter] = useState({ status: "all", category: "all" });

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status !== "all") params.status = filter.status;
      if (filter.category !== "all") params.category = filter.category;

      const result = await getAllPublicNotices(params);
      if (result.success) {
        setNotices(result.notices);
      }
    } catch (error) {
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.effectiveDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    attachments.forEach((file) => {
      submitData.append("attachments", file);
    });

    try {
      let result;
      if (editingNotice) {
        result = await updatePublicNotice(editingNotice._id, submitData);
      } else {
        result = await createPublicNotice(submitData);
      }

      if (result.success) {
        resetForm();
        fetchNotices();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      effectiveDate: new Date(notice.effectiveDate).toISOString().split("T")[0],
      expiryDate: notice.expiryDate
        ? new Date(notice.expiryDate).toISOString().split("T")[0]
        : "",
      isImportant: notice.isImportant,
      status: notice.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      const result = await deletePublicNotice(noticeId);
      if (result.success) {
        fetchNotices();
      }
    }
  };

  const handlePublish = async (noticeId) => {
    const result = await publishPublicNotice(noticeId);
    if (result.success) {
      fetchNotices();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "General",
      effectiveDate: "",
      expiryDate: "",
      isImportant: false,
      status: "draft",
    });
    setAttachments([]);
    setEditingNotice(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Public Notices
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingNotice(null); // Reset editing state
            resetForm(); // Clear form when opening
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center shadow-md"
        >
          {showForm ? "Hide Form" : "Create New Notice"}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              name="status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              name="category"
              value={filter.category}
              onChange={(e) =>
                setFilter({ ...filter, category: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Events">Events</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <button
            onClick={fetchNotices} // Assuming fetchNotices applies the current filter state
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
            {editingNotice ? "Edit Notice" : "Create New Notice"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter notice title"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  required
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="4"
                placeholder="Enter notice content"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Effective Date *
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Attachments (Optional)
              </label>
              <input
                type="file"
                name="attachments"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              {attachments.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  {attachments.length} file(s) selected:{" "}
                  {attachments.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isImportant"
                  name="isImportant"
                  checked={formData.isImportant}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isImportant"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Mark as Important
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors text-sm font-medium shadow-sm"
                  disabled={loading} // Consider a specific submitting state if needed
                >
                  {editingNotice ? "Update Notice" : "Create Notice"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No notices found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your filters or create a new notice.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 leading-tight">
                    {notice.title}
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      notice.status
                    )}`}
                  >
                    {notice.status.charAt(0).toUpperCase() +
                      notice.status.slice(1)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-1">
                  Category:{" "}
                  <span className="font-medium text-gray-600">
                    {notice.category}
                  </span>
                </p>
                {notice.isImportant && (
                  <p className="text-xs font-semibold text-red-500 mb-2 flex items-center">
                    IMPORTANT
                  </p>
                )}

                <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-3">
                  {notice.content}
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Effective:{" "}
                    <span className="font-medium text-gray-600">
                      {new Date(notice.effectiveDate).toLocaleDateString()}
                    </span>
                  </p>
                  {notice.expiryDate && (
                    <p>
                      Expires:{" "}
                      <span className="font-medium text-gray-600">
                        {new Date(notice.expiryDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  <p>
                    Created:{" "}
                    <span className="font-medium text-gray-600">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Attachments:
                    </p>
                    <ul className="space-y-1">
                      {notice.attachments.map((att, index) => (
                        <li key={index} className="text-xs">
                          <a
                            href={att.url} // Assuming attachment object has a URL
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 hover:underline truncate block"
                          >
                            {att.filename || `Attachment ${index + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  {notice.status === "draft" && (
                    <button
                      onClick={() => handlePublish(notice._id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors w-full sm:w-auto"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleEdit(notice);
                      setShowForm(true); // Open form when editing
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicNotice;
