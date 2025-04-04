import React from 'react';

const Submit = () => (
  <div className="space-y-6 text-center animate-fadeIn">
    <div className="text-green-600 text-6xl mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 className="text-2xl font-semibold text-gray-800">Ready to Submit</h2>
    <p className="text-gray-600 max-w-md mx-auto">
      By clicking the submit button, you confirm that all the information provided is correct and agree to the terms and conditions.
    </p>
    
    <div className="mt-6 bg-gray-50 p-4 rounded-lg inline-block">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500" />
        <span className="text-sm text-gray-700">I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a></span>
      </label>
    </div>
    
    <div className="text-xs text-gray-500 mt-4">
      You will receive a confirmation email once your application is processed.
    </div>
  </div>
);

export default Submit;
