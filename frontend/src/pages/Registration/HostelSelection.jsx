import React from "react";

const HostelSelection = ({ formData, handleChange }) => (
  <div className="space-y-4 sm:space-y-5 animate-fadeIn">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
      Hostel Selection
    </h2>

    <div className="space-y-4 sm:space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Gender *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-md min-h-[48px] flex items-center touch-manipulation ${
              formData.gender === "male"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() =>
              handleChange({ target: { name: "gender", value: "male" } })
            }
          >
            <div className="flex items-center w-full">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center ${
                  formData.gender === "male"
                    ? "border-indigo-600"
                    : "border-gray-400"
                }`}
              >
                {formData.gender === "male" && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">
                Male
              </span>
            </div>
          </div>

          <div
            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-md min-h-[48px] flex items-center touch-manipulation ${
              formData.gender === "female"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
            onClick={() =>
              handleChange({ target: { name: "gender", value: "female" } })
            }
          >
            <div className="flex items-center w-full">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center ${
                  formData.gender === "female"
                    ? "border-indigo-600"
                    : "border-gray-400"
                }`}
              >
                {formData.gender === "female" && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-600"></div>
                )}
              </div>
              <span className="ml-2 sm:ml-3 font-medium text-sm sm:text-base">
                Female
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Preference *
        </label>
        <select
          name="roomPreference"
          value={formData.roomPreference}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base min-h-[44px] touch-manipulation"
          required
        >
          <option value="">Select Room Type</option>
          <option value="single">Single Occupancy</option>
          <option value="double">Double Sharing</option>
          <option value="triple">Triple Sharing</option>
        </select>
      </div>
    </div>

    <div className="text-xs text-gray-500 mt-4">
      Fields marked with * are required
    </div>
  </div>
);

export default HostelSelection;
