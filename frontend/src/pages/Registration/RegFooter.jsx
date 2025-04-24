import React from "react";

const RegFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-700">
        {/* Left copyright */}
        <div className="mb-2 md:mb-0">
          © 2025 Lucknow University
        </div>

        {/* Center links */}
        <nav className="flex flex-wrap justify-center space-x-4 text-gray-400">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Refund Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Terms &amp; Condition
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Contact Us
          </a>
        </nav>

        {/* Right powered by */}
        <div className="mt-2 md:mt-0 text-gray-400">
          Powered by -{" "}
          <a
            href="https://www.sritechnocrat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            TEAM SILENT kILLERS
          </a>
        </div>
      </div>
    </footer>
  );
};

export default RegFooter;
