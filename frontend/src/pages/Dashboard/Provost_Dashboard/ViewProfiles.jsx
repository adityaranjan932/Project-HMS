import React from 'react';

const ViewProfiles = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">View Student Profiles</h2>
        <div className="mb-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search by student name or ID" 
              className="flex-grow p-2 border rounded"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              Search
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-2">Student Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">John Smith</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">ST12345</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">Computer Science</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">3rd Year</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">john.smith@university.edu</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            View Full Profile
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
            Send Notice
          </button>
        </div>
      </div>
    );
  };
  

  export default ViewProfiles;