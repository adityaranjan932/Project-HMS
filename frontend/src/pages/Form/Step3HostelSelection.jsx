import React from "react";
import { FaUniversity, FaBed, FaDoorOpen, FaCheck } from "react-icons/fa";

const Step3HostelSelection = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg space-y-8 border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
          <FaUniversity className="text-indigo-600" />
          <span>Hostel Selection</span>
        </h1>
        <form className="space-y-8">
          {/* Campus Name */}
          <div>
            <label
              htmlFor="campus"
              className="block text-base font-medium text-gray-900 flex items-center space-x-2 mb-2"
            >
              <FaUniversity className="text-indigo-500" />
              <span>Campus Name</span>
            </label>
            <select
              id="campus"
              name="campus"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-200 py-3 px-3"
            >
              <option value="">Select Campus</option>
              <option value="main">Main Campus</option>
              <option value="old">Old Campus</option>
            </select>
          </div>

          {/* Hostel Preference 1 */}
          <div>
            <label
              htmlFor="hostelPreference1"
              className="block text-base font-medium text-gray-900 flex items-center space-x-2 mb-2"
            >
              <FaBed className="text-indigo-500" />
              <span>Hostel Preference 1</span>
            </label>
            <select
              id="hostelPreference1"
              name="hostelPreference1"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-200 py-3 px-3"
            >
              <option value="">Select Hostel</option>
              <option value="kautalya">Kautalya</option>
              <option value="lavanya">Lavanya</option>
              <option value="ganga">Ganga</option>
              <option value="br">BR Hostel</option>
            </select>
          </div>

          {/* Hostel Preference 2 */}
          <div>
            <label
              htmlFor="hostelPreference2"
              className="block text-base font-medium text-gray-900 flex items-center space-x-2 mb-2"
            >
              <FaBed className="text-indigo-500" />
              <span>Hostel Preference 2</span>
            </label>
            <select
              id="hostelPreference2"
              name="hostelPreference2"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-200 py-3 px-3"
            >
              <option value="">Select Hostel</option>
              <option value="kautalya">Kautalya</option>
              <option value="lavanya">Lavanya</option>
              <option value="ganga">Ganga</option>
              <option value="br">BR Hostel</option>
            </select>
          </div>

          {/* Room Preference */}
          <div>
            <label
              htmlFor="roomPreference"
              className="block text-base font-medium text-gray-900 flex items-center space-x-2 mb-2"
            >
              <FaDoorOpen className="text-indigo-500" />
              <span>Room Preference</span>
            </label>
            <select
              id="roomPreference"
              name="roomPreference"
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition duration-200 py-3 px-3"
            >
              <option value="">Room Type</option>
              <option value="single">Single</option>
              <option value="triple">Triple</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 flex items-center justify-center space-x-3 transition duration-200"
          >
            <FaCheck className="text-white" />
            <span className="font-semibold">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step3HostelSelection;
