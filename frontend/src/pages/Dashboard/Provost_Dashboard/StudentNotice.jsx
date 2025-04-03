import React from 'react';

const StudentNotice = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Student Notice</h2>
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Search by student name or ID" 
              className="flex-grow p-2 border rounded"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              Search
            </button>
          </div>
          
          <div className="p-4 border rounded bg-white mb-4">
            <h3 className="font-semibold">Selected Student</h3>
            <p>John Smith (ST12345)</p>
          </div>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1">Notice Type</label>
            <select className="w-full p-2 border rounded">
              <option>Behavioral Warning</option>
              <option>Academic Warning</option>
              <option>Disciplinary Action</option>
              <option>General Notice</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Notice Subject</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Notice Details</label>
            <textarea className="w-full p-2 border rounded" rows="4" placeholder="Describe the issue or notice details..."></textarea>
          </div>
          <div>
            <label className="block mb-1">Action Required</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="What the student needs to do..." />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="urgent" className="mr-2" />
            <label htmlFor="urgent">Mark as Urgent</label>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Send Notice</button>
        </form>
      </div>
    );
  };
  

  export default StudentNotice;