import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiChevronDown, FiChevronUp } from "react-icons/fi";
import TopNavbar from "./TopNavbar";
import Footer from "../Footer/Footer";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState("Main Campus");

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const hostels = {
    "Main Campus": ["Kailash", "Habibullah"],
    "New Campus": ["Kautilya", "HJB"],
  };

  const navItems = [
    { name: "Home", to: "/", icon: <FiHome className="text-xl" />, dropdown: false },
    { name: "Hostels", dropdown: true },
    { name: "Student Facilities", dropdown: true, items: ["Facility1", "Facility2", "Facility3"] },
    { name: "Student Online Services", dropdown: true, items: ["Service1", "Service2", "Service3"] },
    { name: "Rules and Regulations", dropdown: true, items: ["Rule1", "Rule2", "Rule3"] },
    { name: "Quick Links", dropdown: true, items: ["Link1", "Link2", "Link3"] },
    { name: "Login", to: "/login", dropdown: false },
    { name: "Register", to: "/register", dropdown: false },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (

    <>
    <TopNavbar/>
    <nav className="bg-red-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/universitylogo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg">HMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center space-x-1 hover:text-yellow-300 transition"
                    >
                      <span>{item.name}</span>
                      {openDropdown === item.name ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                        >
                          {/* Hostels Dropdown */}
                          {item.name === "Hostels" ? (
                            <>
                              {/* Campus Selector */}
                              <div className="px-4 py-2 border-b">
                                <button
                                  onClick={() => setSelectedCampus("Main Campus")}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    selectedCampus === "Main Campus"
                                      ? "bg-gray-100 font-semibold"
                                      : ""
                                  } hover:bg-gray-100`}
                                >
                                  Main Campus
                                </button>
                                <button
                                  onClick={() => setSelectedCampus("New Campus")}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    selectedCampus === "New Campus"
                                      ? "bg-gray-100 font-semibold"
                                      : ""
                                  } hover:bg-gray-100`}
                                >
                                  New Campus
                                </button>
                              </div>

                              {/* Hostel List */}
                              <div>
                                {hostels[selectedCampus].map((hostel, i) => (
                                  <Link
                                    key={i}
                                    to="#"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                  >
                                    {hostel}
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            // Other Dropdown Items
                            item.items.map((subItem, i) => (
                              <Link
                                key={i}
                                to="#"
                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                {subItem}
                              </Link>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // Regular Links
                  <Link to={item.to} className="hover:text-yellow-300 transition">
                    <div className="flex items-center space-x-1">
                      {item.icon && item.icon}
                      {!item.icon && item.name}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => toggleDropdown("mobile")}
              className="text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m0 6H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {openDropdown === "mobile" && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-red-700 text-white shadow-lg z-[999]"
          >
            {/* Mobile Menu Items */}
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  {!item.dropdown ? (
                    // Simple Links
                    <Link to={item.to} className="block px-4 py-2 hover:bg-red-600 rounded-md">
                      {item.name}
                    </Link>
                  ) : (
                    // Dropdowns in Mobile Menu
                    <>
                      <button
                        onClick={() => toggleDropdown(`mobile-${item.name}`)}
                        className={`w-full flex justify-between items-center px-4 py-2 rounded-md ${
                          openDropdown === `mobile-${item.name}` ? "bg-red-600" : ""
                        }`}
                      >
                        {item.name}
                        {openDropdown === `mobile-${item.name}` ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </button>

                      {/* Dropdown Content */}
                      <AnimatePresence>
                        {openDropdown === `mobile-${item.name}` && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-6 space-y-1 bg-red-800 rounded-md"
                          >
                            {/* Hostels Dropdown in Mobile */}
                            {item.name === "Hostels" ? (
                              <>
                                {/* Campus Selector */}
                                {[...Object.keys(hostels)].map((campus) => (
                                  <>
                                    <button
                                      key={campus}
                                      onClick={() => setSelectedCampus(campus)}
                                      className={`block w-full text-left px-4 py-2 ${
                                        selectedCampus === campus ? "bg-red-600 font-semibold" : ""
                                      }`}
                                    >
                                      {campus}
                                    </button>

                                    {/* Hostels List */}
                                    {selectedCampus === campus &&
                                      hostels[campus].map((hostel, i) => (
                                        <Link key={i} to="#" className="block px-4 py-2">
                                          - {hostel}
                                        </Link>
                                      ))}
                                  </>
                                ))}
                              </>
                            ) : (
                              // Other Dropdown Items in Mobile
                              item.items.map((subItem, i) => (
                                <Link key={i} to="#" className="block px-4 py-2">
                                  - {subItem}
                                </Link>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
