import React, { useState } from "react";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        feedbackType,
        message,
      };

      if (feedbackType === "Other") {
        payload.customSubject = customSubject;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/feedback/submit`,
        payload
      );
      alert(response.data.message);
      setFeedbackType("");
      setCustomSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error details:", error); // Log error details for debugging
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(error.response.data.error || "An error occurred on the server.");
      } else if (error.request) {
        // Request was made but no response received
        alert("No response from the server. Please try again later.");
      } else {
        // Something else caused the error
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type *
              </label>
              <select
                value={feedbackType}
                onChange={handleFeedbackTypeChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                required
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Subject *
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                  placeholder="Enter subject"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[120px] text-sm sm:text-base"
                placeholder="Enter your feedback message..."
                rows="6"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
