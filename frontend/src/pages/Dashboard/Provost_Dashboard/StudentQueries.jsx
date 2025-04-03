import React from 'react';

const StudentQueries = () => {
    const queries = [
      { id: 1, student: "Emma Johnson", type: "Maintenance", status: "Pending", date: "Apr 1, 2025" },
      { id: 2, student: "Michael Brown", type: "Academic", status: "Resolved", date: "Mar 28, 2025" },
      { id: 3, student: "Sophia Williams", type: "Facilities", status: "In Progress", date: "Mar 30, 2025" },
      { id: 4, student: "James Davis", type: "Financial", status: "Pending", date: "Apr 2, 2025" },
      { id: 5, student: "Olivia Miller", type: "Academic", status: "Resolved", date: "Mar 25, 2025" }
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Student Queries</h2>
        
        <div className="mb-6 flex justify-between items-center">
          <div>
            <select className="p-2 border rounded">
              <option>All Queries</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search queries" 
              className="p-2 border rounded"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              Search
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border text-left">ID</th>
                <th className="py-2 px-4 border text-left">Student</th>
                <th className="py-2 px-4 border text-left">Type</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">Date</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map(query => (
                <tr key={query.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">#{query.id}</td>
                  <td className="py-2 px-4 border">{query.student}</td>
                  <td className="py-2 px-4 border">{query.type}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      query.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      query.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">{query.date}</td>
                  <td className="py-2 px-4 border">
                    <button className="text-teal-600 hover:text-teal-800 mr-2">View</button>
                    <button className="text-teal-600 hover:text-teal-800">Respond</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Showing 5 of 24 queries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">Previous</button>
            <button className="px-3 py-1 border rounded bg-teal-600 text-white">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StudentQueries;