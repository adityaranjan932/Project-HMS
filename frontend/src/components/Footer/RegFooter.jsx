import React from "react";

const RegFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 space-y-2 md:space-y-0">
        {/* Left copyright */}
        <div className="text-center md:text-left">
          © 2025 Lucknow University
        </div>

        {/* Center links */}
        <nav className="flex flex-wrap justify-center space-x-2 sm:space-x-4 text-gray-400">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 touch-manipulation"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 touch-manipulation"
          >
            Refund Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 touch-manipulation"
          >
            Terms &amp; Condition
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 touch-manipulation"
          >
            Contact Us
          </a>
        </nav>

        {/* Right powered by */}
        <div className="text-gray-400 text-center md:text-right">
          Powered by -{" "}
          <a
            href="https://github.com/amansinghnishad/Project-HMS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded touch-manipulation"
          >
            TEAM SILENT kILLERS
          </a>
        </div>
      </div>
    </footer>
  );
};

export default RegFooter;
