import React from "react";
import { Outlet, Link } from "react-router-dom";
import TopNavbar from "../../components/Navbar/TopNavbar";

function HostelAdminDashboard() {
  return (
    <>
      {/* <TopNavbar /> */}

      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-700">
          Allotment Data
        </h1>
        <nav className="mb-4 sm:mb-6">
          <ul className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <li>
              <Link
                to="students"
                className="block sm:inline-block px-3 py-2 rounded-md text-sm sm:text-base text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
              >
                Registered Students
              </Link>
            </li>
            <li>
              <Link
                to="alloted_hostels_list"
                className="block sm:inline-block px-3 py-2 rounded-md text-sm sm:text-base text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
              >
                Hostel Allotment
              </Link>
            </li>
          </ul>
        </nav>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default HostelAdminDashboard;
