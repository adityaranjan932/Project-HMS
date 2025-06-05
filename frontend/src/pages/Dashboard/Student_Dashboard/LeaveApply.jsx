import React, { useState } from "react";
import { apiConnector } from "../../../services/apiconnector";

const LeaveApply = () => {
  const [formData, setFormData] = useState({
    studentId: "12345", // Replace with actual student ID from context or state
    reason: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector("POST", "/leave/submit", formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Leave Application
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Reason for Leave *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-y min-h-[100px] text-sm sm:text-base"
                placeholder="Enter the reason for your leave"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApply;
