import React from 'react';

const HostelSelection = ({ formData, handleChange }) => (
  <div className="space-y-5 animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Hostel Selection</h2>
    
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type *</label>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
              formData.hostelType === 'boys' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300'
            }`}
            onClick={() => handleChange({ target: { name: 'hostelType', value: 'boys' } })}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.hostelType === 'boys' ? 'border-indigo-600' : 'border-gray-400'
              }`}>
                {formData.hostelType === 'boys' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
              </div>
              <span className="ml-2 font-medium">Boys Hostel</span>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
              formData.hostelType === 'girls' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300'
            }`}
            onClick={() => handleChange({ target: { name: 'hostelType', value: 'girls' } })}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.hostelType === 'girls' ? 'border-indigo-600' : 'border-gray-400'
              }`}>
                {formData.hostelType === 'girls' && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
              </div>
              <span className="ml-2 font-medium">Girls Hostel</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room Preference *</label>
        <select
          name="roomPreference"
          value={formData.roomPreference}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
        >
          <option value="">Select Room Type</option>
          <option value="single">Single Occupancy</option>
          <option value="double">Double Sharing</option>
          <option value="triple">Triple Sharing</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan *</label>
        <select
          name="mealPlan"
          value={formData.mealPlan}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          required
        >
          <option value="">Select Meal Plan</option>
          <option value="veg">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="both">Both Options</option>
        </select>
      </div>
    </div>
    
    <div className="text-xs text-gray-500 mt-4">
      Fields marked with * are required
    </div>
  </div>
);

export default HostelSelection;
