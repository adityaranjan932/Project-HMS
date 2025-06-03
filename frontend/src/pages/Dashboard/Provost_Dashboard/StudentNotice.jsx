import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaUser,
  FaEye,
} from "react-icons/fa";
import { sendNotice, getSentNotices } from "../../../services/auth";
import { getAllAllottedStudents } from "../../../services/auth";
import { toast } from "react-hot-toast";

const StudentNotice = () => {
  // Form state
  const [formData, setFormData] = useState({
    recipientId: "",
    noticeType: "",
    subject: "",
    message: "",
    actionRequired: "",
    isUrgent: false,
  });

  // Student management state
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Loading and submission state
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Notice history state
  const [sentNotices, setSentNotices] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load allotted students on component mount
  useEffect(() => {
    loadAllottedStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents([]);
      setShowStudentDropdown(false);
    } else {
      const filtered = students.filter((student) => {
        const name = student.studentProfileId?.name || "";
        const rollNumber = student.studentProfileId?.rollNumber || "";
        const email = student.studentProfileId?.email || "";

        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredStudents(filtered);
      setShowStudentDropdown(filtered.length > 0);
    }
  }, [searchTerm, students]);

  const loadAllottedStudents = async () => {
    try {
      setStudentsLoading(true);
      const response = await getAllAllottedStudents();
      if (response?.success) {
        setStudents(response.data || []);
      } else {
        toast.error("Failed to load students");
      }
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Error loading students");
    } finally {
      setStudentsLoading(false);
    }
  };

  const loadSentNotices = async () => {
    try {
      setHistoryLoading(true);
      const response = await getSentNotices(1, 10);
      if (response?.success) {
        setSentNotices(response.data || []);
      }
    } catch (error) {
      console.error("Error loading sent notices:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchTerm(
      `${student.studentProfileId?.name} (${student.studentProfileId?.rollNumber})`
    );
    setFormData((prev) => ({
      ...prev,
      recipientId: student.studentProfileId?._id,
    }));
    setShowStudentDropdown(false);
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setSearchTerm("");
    setFormData((prev) => ({
      ...prev,
      recipientId: "",
    }));
  };

  const resetForm = () => {
    setFormData({
      recipientId: "",
      noticeType: "",
      subject: "",
      message: "",
      actionRequired: "",
      isUrgent: false,
    });
    clearSelectedStudent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipientId) {
      toast.error("Please select a student");
      return;
    }

    if (!formData.noticeType || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await sendNotice(formData);

      if (response?.success) {
        toast.success("Notice sent successfully!");
        resetForm();
        // Refresh sent notices if history is being shown
        if (showHistory) {
          loadSentNotices();
        }
      }
    } catch (error) {
      console.error("Error sending notice:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory && sentNotices.length === 0) {
      loadSentNotices();
    }
  };

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case "Behavioral Warning":
        return "bg-yellow-100 text-yellow-800";
      case "Academic Warning":
        return "bg-orange-100 text-orange-800";
      case "Disciplinary Action":
        return "bg-red-100 text-red-800";
      case "General Notice":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin mr-3 text-2xl text-teal-600" />
        <p className="text-lg text-gray-600">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Student Notice</h2>
        <button
          onClick={toggleHistory}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaEye className="mr-2" />
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notice Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Send Notice to Student
            </h3>

            {/* Student Search and Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search & Select Student *
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by name, roll number, or email..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {selectedStudent && (
                    <button
                      type="button"
                      onClick={clearSelectedStudent}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Student Dropdown */}
                {showStudentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => handleStudentSelect(student)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-800">
                          {student.studentProfileId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Roll: {student.studentProfileId?.rollNumber || "N/A"}{" "}
                          • Room: {student.allottedRoomNumber || "N/A"} • Email:{" "}
                          {student.studentProfileId?.email || "N/A"}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Student Display */}
                {selectedStudent && (
                  <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex items-center">
                      <FaUser className="text-teal-600 mr-2" />
                      <div>
                        <div className="font-medium text-teal-800">
                          {selectedStudent.studentProfileId?.name}
                        </div>
                        <div className="text-sm text-teal-600">
                          Roll: {selectedStudent.studentProfileId?.rollNumber} •
                          Room: {selectedStudent.allottedRoomNumber} • Floor:{" "}
                          {selectedStudent.floor}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Type *
                  </label>
                  <select
                    name="noticeType"
                    value={formData.noticeType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Behavioral Warning">
                      Behavioral Warning
                    </option>
                    <option value="Academic Warning">Academic Warning</option>
                    <option value="Disciplinary Action">
                      Disciplinary Action
                    </option>
                    <option value="General Notice">General Notice</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgent"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="urgent"
                      className="ml-2 text-sm font-medium text-gray-700 flex items-center"
                    >
                      <FaExclamationTriangle className="text-yellow-500 mr-1" />
                      Mark as Urgent
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter notice subject"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe the issue or notice details..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Required (Optional)
                </label>
                <input
                  type="text"
                  name="actionRequired"
                  value={formData.actionRequired}
                  onChange={handleInputChange}
                  placeholder="What the student needs to do..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || !selectedStudent}
                  className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Send Notice
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notice History */}
        <div className="lg:col-span-1">
          {showHistory && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Notices
              </h3>

              {historyLoading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin mx-auto text-2xl text-teal-600 mb-2" />
                  <p className="text-gray-600">Loading history...</p>
                </div>
              ) : sentNotices.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No notices sent yet
                </p>
              ) : (
                <div className="space-y-3">
                  {sentNotices.map((notice) => (
                    <div
                      key={notice._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getNoticeTypeColor(
                            notice.noticeType
                          )}`}
                        >
                          {notice.noticeType}
                        </span>
                        {notice.isUrgent && (
                          <FaExclamationTriangle className="text-yellow-500" />
                        )}
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">
                        {notice.subject}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        To: {notice.recipientId?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                      {notice.isRead && (
                        <div className="mt-2 flex items-center text-green-600 text-xs">
                          <FaCheck className="mr-1" />
                          Read
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotice;
