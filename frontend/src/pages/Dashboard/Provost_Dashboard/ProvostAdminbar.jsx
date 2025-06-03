import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaClipboardList,
  FaBullhorn,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaDatabase
} from "react-icons/fa";
import { logout } from '../../../services/auth';
import { toast } from 'react-hot-toast';

const ProvostAdminbar = () => {  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        const result = await logout(token);
        if (result && result.success) {
          // Navigate to login page after successful logout
          navigate('/login');
        }
      } else {
        // If no token found, still clear storage and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        toast.success("Logged out successfully!");
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-all"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-teal-800 to-teal-900 shadow-xl transition-transform duration-300 ease-in-out z-40 flex flex-col`} // Added flex flex-col
      >
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-white md:ml-0 ml-8">
            Provost Portal
          </h2>
          <div className="mt-2 h-1 w-16 bg-teal-400 mx-auto rounded-full"></div>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white p-1">
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                <FaUserCircle className="text-gray-600" size={50} />
              </div>
            </div>
          </div>
          <p className="text-center text-teal-200 font-medium">
            Welcome, Provost
          </p>
        </div>

        <ul className="mt-8 space-y-1 px-3 flex-grow overflow-y-auto"> {/* Added flex-grow overflow-y-auto */}
          <li>
            <Link
              to="/provost-login/view-profiles"
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/view-profiles")
                  ? "bg-teal-700 text-white font-medium shadow-md"
                  : "text-teal-100 hover:bg-teal-700/50"
                }`}
            >
              <FaSearch className="mr-3" />
              View Student Profiles
            </Link>
          </li>
          <li>
            <Link
              to="/provost-login/student-notice"
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/student-notice")
                  ? "bg-teal-700 text-white font-medium shadow-md"
                  : "text-teal-100 hover:bg-teal-700/50"
                }`}
            >
              <FaBell className="mr-3" />
              Student Notice
            </Link>
          </li>
          <li>
            <Link
              to="/provost-login/student-queries"
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/student-queries")
                  ? "bg-teal-700 text-white font-medium shadow-md"
                  : "text-teal-100 hover:bg-teal-700/50"
                }`}
            >
              <FaClipboardList className="mr-3" />
              Student Queries
            </Link>
          </li>
          <li>
            <Link
              to="/provost-login/public-notice"
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/public-notice")
                  ? "bg-teal-700 text-white font-medium shadow-md"
                  : "text-teal-100 hover:bg-teal-700/50"
                }`}
            >
              <FaBullhorn className="mr-3" />
              Public Notice
            </Link>
          </li>

          <li>
            <Link
              to="/provost-login/allotment-data"
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/allotment-data") // Corrected isActive check
                  ? "bg-teal-700 text-white font-medium shadow-md"
                  : "text-teal-100 hover:bg-teal-700/50"
                }`}
            >
              <FaDatabase className="mr-3" />
              Allotment Data
            </Link>
          </li>

        </ul>

        {/* Removed absolute bottom-0 w-full from the div below */}
        <div className="p-4"> 
          <div className="bg-teal-700/30 rounded-lg p-4 text-teal-200 text-sm">
            <p className="font-medium mb-1">Need help?</p>
            <p>Contact IT support at it@university.edu</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800 md:ml-0 ml-10">
              Provost Dashboard
            </h1>

            {/* Right side elements */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-100 shadow-sm cursor-pointer hover:border-teal-300 transition-all"
                  onClick={() => setShowProfileModal(true)}
                />

                {/* Dropdown menu */}
                {showLogoutMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowLogoutMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                className="flex items-center justify-center p-2 rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-all"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </div>

          {/* Breadcrumb or secondary header */}
          <div className="px-6 py-2 bg-teal-50 border-t border-teal-100">
            <p className="text-sm text-teal-800">
              Thursday, April 03, 2025, 7:29 PM IST • Spring Semester
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 lg:p-8 xl:p-10 overflow-auto bg-gray-50"> {/* Added more padding for different screen sizes */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200 min-h-[calc(100vh-180px)]"> {/* Increased shadow, padding and ensured min height */}
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600 mt-auto"> {/* Ensured footer is at the bottom */}
          © 2025 University Provost Portal • All rights reserved
        </footer>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0   z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Profile Photo</h3>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium text-lg">Dr. James Wilson</p>
                <p className="text-gray-600">Provost ID: PR12345</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvostAdminbar;
