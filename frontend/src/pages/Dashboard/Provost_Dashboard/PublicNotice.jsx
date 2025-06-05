import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  createPublicNotice, 
  getAllPublicNotices, 
  updatePublicNotice, 
  deletePublicNotice, 
  publishPublicNotice 
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
    status: "draft"
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
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    attachments.forEach(file => {
      submitData.append('attachments', file);
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
      effectiveDate: new Date(notice.effectiveDate).toISOString().split('T')[0],
      expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : "",
      isImportant: notice.isImportant,
      status: notice.status
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
      status: "draft"
    });
    setAttachments([]);
    setEditingNotice(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Public Notice Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          {showForm ? "Cancel" : "Create New Notice"}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Status Filter:</label>
          <select 
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category Filter:</label>
          <select 
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Administrative">Administrative</option>
            <option value="Events">Events</option>
            <option value="Facilities">Facilities</option>
            <option value="Emergency">Emergency</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold">
            {editingNotice ? "Edit Notice" : "Create New Notice"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Notice Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category *</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Events">Events</option>
                <option value="Facilities">Facilities</option>
                <option value="Emergency">Emergency</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Notice Content *</label>
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500" 
              rows="6"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Effective Date *</label>
              <input 
                type="date" 
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Expiry Date (Optional)</label>
              <input 
                type="date" 
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Attachments (Optional)</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG (Max 10MB per file)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleInputChange}
                className="mr-2"
              />
              Mark as Important
            </label>
          </div>

          <div className="flex gap-2">
            <button 
              type="submit"
              onClick={() => setFormData(prev => ({ ...prev, status: "published" }))}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Publish Notice
            </button>
            <button 
              type="submit"
              onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Save as Draft
            </button>
            <button 
              type="button"
              onClick={resetForm}
              className="bg-red-200 text-red-800 px-4 py-2 rounded hover:bg-red-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">
          Public Notices ({notices.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notices found. Create your first public notice!
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="p-4 bg-white rounded border flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-lg">{notice.title}</h4>
                    {notice.isImportant && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2 line-clamp-2">{notice.content}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><span className="font-medium">Category:</span> {notice.category}</p>
                    <p><span className="font-medium">Effective:</span> {new Date(notice.effectiveDate).toLocaleDateString()}</p>
                    {notice.expiryDate && (
                      <p><span className="font-medium">Expires:</span> {new Date(notice.expiryDate).toLocaleDateString()}</p>
                    )}
                    <p><span className="font-medium">Created:</span> {new Date(notice.createdAt).toLocaleDateString()}</p>
                    {notice.publishedAt && (
                      <p><span className="font-medium">Published:</span> {new Date(notice.publishedAt).toLocaleDateString()}</p>
                    )}
                    {notice.views > 0 && (
                      <p><span className="font-medium">Views:</span> {notice.views}</p>
                    )}
                    {notice.attachments && notice.attachments.length > 0 && (
                      <p><span className="font-medium">Attachments:</span> {notice.attachments.length} file(s)</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(notice.status)}`}>
                    {notice.status.toUpperCase()}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(notice)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    {notice.status === 'draft' && (
                      <button 
                        onClick={() => handlePublish(notice._id)}
                        className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                      >
                        Publish
                      </button>
                    )}
                    {notice.pdfPath && (
                      <a 
                        href={`${import.meta.env.VITE_API_BASE_URL}/${notice.pdfPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded border border-purple-200 hover:bg-purple-50"
                      >
                        PDF
                      </a>
                    )}
                    <button 
                      onClick={() => handleDelete(notice._id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded border border-red-200 hover:bg-red-50"
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
    </div>
  );
};

export default PublicNotice;
