import React from 'react';

const PublicNotice = () => {
    const notices = [
      { id: 1, title: "Campus Maintenance Schedule", date: "Apr 1, 2025", status: "Published" },
      { id: 2, title: "Upcoming Academic Events", date: "Mar 28, 2025", status: "Draft" },
      { id: 3, title: "Library Hours Change", date: "Mar 30, 2025", status: "Published" }
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Public Notice</h2>
        
        <div className="mb-6">
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 mb-4">
            Create New Notice
          </button>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Recent Notices</h3>
            
            <div className="space-y-3">
              {notices.map(notice => (
                <div key={notice.id} className="p-3 bg-white rounded border flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{notice.title}</h4>
                    <p className="text-sm text-gray-500">Published: {notice.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notice.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notice.status}
                    </span>
                    <button className="text-teal-600 hover:text-teal-800">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <form className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Create New Notice</h3>
          
          <div>
            <label className="block mb-1">Notice Title</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          
          <div>
            <label className="block mb-1">Notice Category</label>
            <select className="w-full p-2 border rounded">
              <option>Academic</option>
              <option>Administrative</option>
              <option>Events</option>
              <option>Facilities</option>
              <option>Emergency</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Notice Content</label>
            <textarea className="w-full p-2 border rounded" rows="6"></textarea>
          </div>
          
          <div>
            <label className="block mb-1">Effective Date</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="important" className="mr-2" />
            <label htmlFor="important">Mark as Important</label>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Publish Notice</button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Save as Draft</button>
          </div>
        </form>
      </div>
    );
  };
  
  export default PublicNotice;