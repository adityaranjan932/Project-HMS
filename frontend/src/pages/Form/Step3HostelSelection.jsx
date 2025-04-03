import React from "react";

const Step3HostelSelection = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h1 className="text-2xl font-bold mb-4">Hostel Selection</h1>
      <form className="space-y-6">
        {/* Campus Name */}
        <div>
          <label
            htmlFor="campus"
            className="block text-sm font-medium text-gray-700"
          >
            Campus Name
          </label>
          <select
            id="campus"
            name="campus"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="block text-sm font-medium text-gray-700"
          >
            Hostel Preference 1
          </label>
          <select
            id="hostelPreference1"
            name="hostelPreference1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="block text-sm font-medium text-gray-700"
          >
            Hostel Preference 2
          </label>
          <select
            id="hostelPreference2"
            name="hostelPreference2"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="block text-sm font-medium text-gray-700"
          >
            Room Preference
          </label>
          <select
            id="roomPreference"
            name="roomPreference"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Room Type</option>
            <option value="single">Single</option>
            <option value="triple">Triple</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Step3HostelSelection;
