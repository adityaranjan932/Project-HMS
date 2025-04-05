import React, { useState } from "react";

const LeaveApply = () => {
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Application Submitted:", formData);
    // Add submission logic here
  };

  return (
    <div className="p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Leave Application
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Reason for Leave
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700"
            placeholder="Enter the reason for your leave"
            required
          />
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700"
            required
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveApply;
