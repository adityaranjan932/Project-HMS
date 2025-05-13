import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiChevronDown, FiChevronUp } from "react-icons/fi";
import TopNavbar from "./TopNavbar";
import DropdownContent from "./DropdownContent";
import hostelDataAll from "../../../utils/HostelDetails.json"; // Import all hostel data

const Navbar = () => {
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);

  const toggleDesktopDropdown = (menu) => {
    setOpenDesktopDropdown(openDesktopDropdown === menu ? null : menu);
  };

  const toggleMobileNav = () => {
    const newMobileNavOpenState = !isMobileNavOpen;
    setIsMobileNavOpen(newMobileNavOpenState);
    if (!newMobileNavOpenState) {
      setActiveMobileSubmenu(null); // Close submenu when mobile nav closes
    }
  };

  const toggleMobileSubmenu = (submenu) => {
    setActiveMobileSubmenu(activeMobileSubmenu === submenu ? null : submenu);
  };

  // Closes dropdowns/menus when an item is clicked
  const handleDropdownItemClicked = (isMobileView) => {
    if (isMobileView) {
      setActiveMobileSubmenu(null);
      setIsMobileNavOpen(false);
    } else {
      setOpenDesktopDropdown(null);
    }
  };

  const handleSimpleMobileLinkClick = () => {
    setIsMobileNavOpen(false);
  };

  const navItems = [
    {
      name: "",
      to: "/",
      icon: <FiHome className="text-xl" />,
      dropdown: false,
    },
    { name: "Hostels", dropdown: true },
    {
      name: "Student Facilities",
      dropdown: true,
      items: [
        {
          name: "Mess & Canteen",
          id: "mess-canteen",
          to: "/facility/mess-canteen",
        },
        {
          name: "Laundry Services",
          id: "laundry-services",
          to: "/facility/laundry-services",
        },
        { name: "Sports & Gym", id: "sports-gym", to: "/facility/sports-gym" },
        {
          name: "Reading Room",
          id: "reading-room",
          to: "/facility/reading-room",
        },
        {
          name: "Wi-Fi Information",
          id: "wifi-information",
          to: "/facility/wifi-information",
        },
      ],
    },

    {
      name: "Rules and Regulations",
      dropdown: true,
      items: [
        {
          name: "Anti-Ragging Policy",
          id: "anti-ragging",
          to: "/rules/anti-ragging",
        },
        {
          name: "Hostel Timings & Entry/Exit",
          id: "hostel-timings",
          to: "/rules/hostel-timings",
        },
        {
          name: "Guest & Visitor Policy",
          id: "guest-policy",
          to: "/rules/guest-policy",
        },
        {
          name: "Mess Rules & Etiquette",
          id: "mess-rules",
          to: "/rules/mess-rules",
        },
        {
          name: "Room Allotment & Upkeep",
          id: "room-upkeep",
          to: "/rules/room-upkeep",
        },
        {
          name: "Use of Common Areas & Facilities",
          id: "common-areas",
          to: "/rules/common-areas",
        },
        {
          name: "Prohibited Items & Activities",
          id: "prohibited-items",
          to: "/rules/prohibited-items",
        },
        {
          name: "Disciplinary Actions",
          id: "disciplinary-actions",
          to: "/rules/disciplinary-actions",
        },
      ],
    },
    {
      name: "Quick Links",
      dropdown: true,
      items: [
        {
          name: "University Website",
          href: "https://www.lkouniv.ac.in/en",
          external: true,
        },
        {
          name: "Semester Fee Payment",
          href: "https://fee.lkouniv.ac.in/",
          external: true,
        },
        {
          name: "UDRC Portal",
          href: "https://udrc.lkouniv.ac.in/student",
          external: true,
        },
      ],
    },
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
      <TopNavbar />
      <nav className="bg-red-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/universitylogo.png"
                alt="Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg">HMS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDesktopDropdown(item.name)}
                        className="flex items-center space-x-1 hover:text-yellow-300 transition"
                      >
                        <span>{item.name}</span>
                        {openDesktopDropdown === item.name ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </button>
                      <AnimatePresence>
                        {openDesktopDropdown === item.name && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                          >
                            <DropdownContent
                              item={item}
                              isMobile={false}
                              allHostelData={hostelDataAll} // Pass all hostel data
                              onItemClick={handleDropdownItemClicked}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    // Regular Links
                    <Link
                      to={item.to}
                      className="hover:text-yellow-300 transition"
                    >
                      <div className="flex items-center space-x-1">
                        {item.icon && item.icon}
                        <span>{item.name}</span>{" "}
                        {/* Display name alongside icon */}
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileNav}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m0 6H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileNavOpen && (
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
                      <Link
                        to={item.to}
                        onClick={handleSimpleMobileLinkClick} // Close mobile nav on click
                        className="block px-4 py-2 hover:bg-red-600 rounded-md"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      // Dropdowns in Mobile Menu
                      <>
                        <button
                          onClick={() => toggleMobileSubmenu(item.name)}
                          className={`w-full flex justify-between items-center px-4 py-2 rounded-md ${
                            activeMobileSubmenu === item.name
                              ? "bg-red-600"
                              : ""
                          }`}
                        >
                          {item.name}
                          {activeMobileSubmenu === item.name ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </button>

                        {/* Dropdown Content */}
                        <AnimatePresence>
                          {activeMobileSubmenu === item.name && (
                            <motion.div
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="pl-6 space-y-1 bg-red-800 rounded-md"
                            >
                              <DropdownContent
                                item={item}
                                isMobile={true}
                                allHostelData={hostelDataAll} // Pass all hostel data
                                onItemClick={handleDropdownItemClicked}
                              />
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
