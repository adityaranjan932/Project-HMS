import React from 'react';

const Preview = ({ formData }) => (
  <div className="space-y-6 animate-fadeIn">
    <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Preview Your Information</h2>
    
    <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-medium text-indigo-600 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-gray-600 font-medium">Name:</div>
        <div>{formData.firstName} {formData.lastName}</div>
        <div className="text-gray-600 font-medium">Date of Birth:</div>
        <div>{formData.dateOfBirth}</div>
        <div className="text-gray-600 font-medium">Roll Number:</div>
        <div>{formData.rollno || 'Not provided'}</div>
        <div className="text-gray-600 font-medium">Father's Name:</div>
        <div>{formData.fatherName || 'Not provided'}</div>
        <div className="text-gray-600 font-medium">Gender:</div>
        <div>{formData.gender}</div>
      </div>
    </div>
    
    <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-medium text-indigo-600 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        Contact Information
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-gray-600 font-medium">Email:</div>
        <div>{formData.email}</div>
        <div className="text-gray-600 font-medium">Mobile:</div>
        <div>{formData.mobile}</div>
      </div>
    </div>
    
    <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-medium text-indigo-600 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Hostel Preferences
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-gray-600 font-medium">Hostel Type:</div>
        <div>{formData.hostelType === 'boys' ? 'Boys Hostel' : formData.hostelType === 'girls' ? 'Girls Hostel' : ''}</div>
        <div className="text-gray-600 font-medium">Room Preference:</div>
        <div>
          {formData.roomPreference === 'single' ? 'Single Occupancy' : 
           formData.roomPreference === 'double' ? 'Double Sharing' : 
           formData.roomPreference === 'triple' ? 'Triple Sharing' : ''}
        </div>
        <div className="text-gray-600 font-medium">Meal Plan:</div>
        <div>
          {formData.mealPlan === 'veg' ? 'Vegetarian' : 
           formData.mealPlan === 'nonveg' ? 'Non-Vegetarian' : 
           formData.mealPlan === 'both' ? 'Both Options' : ''}
        </div>
      </div>
    </div>
    
    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
      Please review all information carefully before proceeding to submit. You won't be able to make changes after submission.
    </p>
  </div>
);

export default Preview;
