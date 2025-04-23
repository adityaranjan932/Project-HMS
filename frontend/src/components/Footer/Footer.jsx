import React from "react";
import "@fortawesome/fontawesome-free/css/all.css";

const Footer = () => {
  return (
    <>
      {/* Main Footer Section */}
      <div className="w-full bg-gray-900 text-white flex flex-col lg:flex-row justify-between items-start p-6">
        {/* University Logo Section */}
        <a
          href="/universitylogo.png"
          className="flex-shrink-0 w-full bg-gray-700 p-3 text-center lg:w-[300px] flex flex-col items-center mb-6 lg:mb-0"
        >
          <img
            src="/universitylogo.png"
            alt="University Logo"
            className="h-16 w-16 mb-2"
          />
          <h1 className="text-2xl font-semibold">University of Lucknow</h1>
          <p className="text-sm font-semibold">Hostel Management System</p>
        </a>

        {/* Navigation Links Section */}
        <div className="w-full lg:w-1/3 flex flex-col mt-4 md:flex-row justify-center items-center text-xl lg:text-lg">
          <a href="/" className="m-2 hover:opacity-75">
            Home
          </a>
          <a href="/hostels" className="m-2 hover:opacity-75">
            Hostels
          </a>
          <a href="/rules" className="m-2 hover:opacity-75">
            Rules & Regulations
          </a>
          <a href="/contact" className="m-2 hover:opacity-75">
            Contact Us
          </a>
        </div>

        {/* Social Media Icons Section */}
        <div className="flex justify-center mt-6 space-x-3 md:space-x-6 md:py-4">
          <a
            href="https://www.facebook.com/universityoflucknow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-facebook text-xl bg-gray-700 p-3 rounded-full hover:opacity-75"></i>
          </a>
          <a
            href="https://twitter.com/universityoflucknow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-twitter text-xl bg-gray-700 p-3 rounded-full hover:opacity-75"></i>
          </a>
          <a
            href="https://www.youtube.com/universityoflucknow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-youtube text-xl bg-gray-700 p-3 rounded-full hover:opacity-75"></i>
          </a>
          <a
            href="mailto:hostel.management@lkouniv.ac.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-envelope text-xl bg-gray-700 p-3 rounded-full hover:opacity-75"></i>
          </a>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="w-full border-t border-gray-700 flex flex-col justify-center items-center bg-gray-900 py-4">
        <h3 className="text-lg font-bold text-white mb-2">Contact Details</h3>
        <p className="text-sm text-gray-400 mb-2 text-center px-4">
          For any hostel-related queries, please contact:
        </p>
        <div className="flex flex-col md:flex-row justify-around w-full max-w-screen-md px-4">
          {/* Contact 1 */}
          <p className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer mb-2 md:mb-0">
            Dr. Khushboo Verma - (7991200535)
          </p>

          {/* Contact 2 */}
          <p className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer mb-2 md:mb-0">
            Dr. Rachana Pathak - (9044375304)
          </p>

          {/* Contact 3 */}
          <p className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer mb-2 md:mb-0">
            Dr. Savya Sachi - (9811746901)
          </p>

          {/* Contact 4 */}
          <p className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer mb-2 md:mb-0">
            Dr. R. P. Singh - (8090196096)
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-800 py-3 text-center text-white">
        &copy; {new Date().getFullYear()} University of Lucknow - Hostel
        Management System. All rights reserved.
      </div>

      {/* Technical Support Section */}
      <div className="bg-gray-900 py-[6px] text-right pr-[10px] text-sm text-gray-500">
        For technical issues, contact{" "}
        <strong>
          <a
            href="/techteam"
            className="text-blue-500 hover:text-blue-400 underline"
          >
            Technical Support Team
          </a>
        </strong>
        .
      </div>
    </>
  );
};

export default Footer;
