import React from "react";

const NoticeBoard = () => (
  <div className="p-4 bg-red-50 rounded-lg shadow-md border border-red-200 h-full">
    <h3 className="text-xl font-bold mb-3 text-red-800 border-b-2 border-red-700 pb-2">
      Notice Board
    </h3>
    <ul className="space-y-2">
      <li className="text-sm text-gray-700 hover:text-red-700 cursor-pointer">
        <span className="font-semibold text-red-600">New:</span> Admissions for
        2025-26 are open.{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Read more...
        </a>
      </li>
      <li className="text-sm text-gray-700 hover:text-red-700 cursor-pointer">
        Hostel allotment list published.{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Check here...
        </a>
      </li>
      <li className="text-sm text-gray-700 hover:text-red-700 cursor-pointer">
        Upcoming maintenance schedule for Block A.
      </li>
      <li className="text-sm text-gray-700 hover:text-red-700 cursor-pointer">
        Annual sports meet registration.{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Register now...
        </a>
      </li>
    </ul>
    <button className="mt-4 w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition-colors text-sm font-medium">
      View All Notices
    </button>
  </div>
);

export default NoticeBoard;
