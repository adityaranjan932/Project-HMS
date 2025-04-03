import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaWrench, FaCommentAlt, FaCalendarAlt, FaCreditCard, FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const Adminbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900 shadow-2xl transition-transform duration-300 ease-in-out z-40`}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide md:ml-0 ml-10">Student Portal</h2>
          <div className="mt-2 h-1 w-16 bg-indigo-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="px-4 py-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <FaUserCircle className="text-gray-600" size={50} />
              </div>
            </div>
          </div>
          <p className="text-center text-indigo-200 font-medium">Welcome, Student</p>
        </div>
        
        <ul className="mt-8 space-y-2 px-3">
          <li>
            <Link 
              to="/student-login/maintenance-request" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/maintenance-request') 
                  ? 'bg-indigo-700 text-white font-medium shadow-md' 
                  : 'text-indigo-100 hover:bg-indigo-600/50 hover:translate-x-1'
              }`}
            >
              <FaWrench className="mr-3" />
              Maintenance Request
            </Link>
          </li>
          <li>
            <Link 
              to="/student-login/feedback" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/feedback') 
                  ? 'bg-indigo-700 text-white font-medium shadow-md' 
                  : 'text-indigo-100 hover:bg-indigo-600/50 hover:translate-x-1'
              }`}
            >
              <FaCommentAlt className="mr-3" />
              Feedback
            </Link>
          </li>
          <li>
            <Link 
              to="/student-login/leave-apply" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/leave-apply') 
                  ? 'bg-indigo-700 text-white font-medium shadow-md' 
                  : 'text-indigo-100 hover:bg-indigo-600/50 hover:translate-x-1'
              }`}
            >
              <FaCalendarAlt className="mr-3" />
              Leave Apply
            </Link>
          </li>
          <li>
            <Link 
              to="/student-login/fees-payment" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/fees-payment') 
                  ? 'bg-indigo-700 text-white font-medium shadow-md' 
                  : 'text-indigo-100 hover:bg-indigo-600/50 hover:translate-x-1'
              }`}
            >
              <FaCreditCard className="mr-3" />
              Fees Payment
            </Link>
          </li>
        </ul>
        
        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-indigo-700/30 backdrop-blur-sm rounded-lg p-4 text-indigo-200 text-sm border border-indigo-600/20">
            <p className="font-medium mb-1">Need help?</p>
            <p>Contact support at support@university.edu</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800 md:ml-0 ml-10">Student Dashboard</h1>
            
            {/* Right side elements */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm cursor-pointer hover:border-indigo-300 transition-all duration-300 transform hover:scale-110"
                  onClick={() => setShowProfileModal(true)}
                />
                
                {/* Dropdown menu */}
                {showLogoutMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 animate-fadeIn">
                    <button 
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowLogoutMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Logout button */}
              <button 
                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                className="flex items-center justify-center p-2 rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-all duration-300 transform hover:rotate-12"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </div>
          
          {/* Breadcrumb or secondary header */}
          <div className="px-6 py-2 bg-indigo-50 border-t border-indigo-100">
            <p className="text-sm text-indigo-800">
              Thursday, April 03, 2025, 8:02 PM IST • Spring Semester
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 overflow-auto bg-gray-50 bg-pattern">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
          © 2025 University Student Portal • All rights reserved
        </footer>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-transparent  z-30 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FaTimes size={24} />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-900">Profile Photo</h3>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Profile" 
                  className="w-64 h-64 object-cover rounded-lg shadow-md border-4 border-indigo-100"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium text-lg text-indigo-900">John Doe</p>
                <p className="text-gray-600">Student ID: ST12345</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminbar;
