import React from "react";
import { Outlet, Link } from "react-router-dom";
import TopNavbar from "../../components/Navbar/TopNavbar";

function HostelAdminDashboard() {
  return (
    <>
      {/* <TopNavbar /> */}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Allotment Data Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage student registrations and hostel allotments
            </p>
          </div>

          <nav className="mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Navigation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="students"
                  className="group flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-700">
                      Registered Students
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      View and manage student profiles and registrations
                    </p>
                  </div>
                </Link>

                <Link
                  to="alloted_hostels_list"
                  className="group flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-green-700">
                      Hostel Allotment
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage room allocation and hostel assignments
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </nav>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HostelAdminDashboard;
