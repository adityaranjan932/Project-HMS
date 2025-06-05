import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const RegHeader = () => {
  return (
    <div className="min-h-fit bg-stone-200 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-300">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex-grow">
        <section className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto bg-stone-100 p-3 sm:p-4 md:p-6 rounded shadow-sm">
          <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
            <strong>
              Welcome to University of Lucknow Hostel Management System.
            </strong>
            <br />
            Applications invited <span className="font-semibold">
              online
            </span>{" "}
            for hostel accommodation from regular full time students of the
            University.{" "}
          </p>

          <p className="mt-2 text-center text-blue-700 font-semibold underline cursor-pointer text-sm sm:text-base hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
            Student Hostel Facilities
          </p>

          <hr className="my-3 sm:my-4 border-gray-300" />
        </section>
      </main>
    </div>
  );
};

export default RegHeader;
