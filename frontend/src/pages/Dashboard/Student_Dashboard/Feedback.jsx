import React, { useState } from "react";

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
    if (e.target.value !== "Other") {
      setCustomSubject("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Feedback
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback Type
        </label>
        <select
          value={feedbackType}
          onChange={handleFeedbackTypeChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="Room Related">Room Related</option>
          <option value="Mess Related">Mess Related</option>
          <option value="Hostel Library">Hostel Library</option>
          <option value="Gaming Room Related">Gaming Room Related</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {feedbackType === "Other" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Subject
          </label>
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject"
          />
        </div>
      )}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your message"
          rows="4"
        ></textarea>
      </div>
      <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
        Submit
      </button>
    </div>
  );
};

export default Feedback;
