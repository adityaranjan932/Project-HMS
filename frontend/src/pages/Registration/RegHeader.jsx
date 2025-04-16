import React from 'react';
import universityLogo from '/universitylogo.png';
import Vidya from '/Vidya.png';

const RegHeader = () => {
  return (
    <div className="min-h-fit bg-stone-200 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-300">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
          {/* Left: Logo and University Name */}
          <div className="flex items-center space-x-4">
            <img 
              src={universityLogo}
              alt="University Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-serif text-amber-700 font-semibold">
                University of Lucknow
              </h1>
              <p className="text-sm md:text-base text-gray-700 font-normal">
                (Accredited A++ by NAAC)
              </p>
            </div>
          </div>

          {/* Right: Motto and Centennial */}
          <div className="mt-2 md:mt-0 text-right max-w-xs md:max-w-md">
            <p className="text-amber-700 italic font-serif text-sm md:text-base leading-snug">
              A century of leading generations to
            </p>
            <p className="text-amber-700 italic font-serif text-sm md:text-base leading-snug">
              light through learning
            </p>
            <div className="mt-2">
              <img 
                src={Vidya} 
                alt="100 Years Centennial" 
                className="inline-block h-14 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="max-w-5xl mx-auto bg-stone-100 p-6 rounded shadow-sm">
          <p className="text-gray-800 text-base md:text-lg leading-relaxed">
            <strong>Welcome to University of Lucknow Hostel Management System.</strong><br />
            Applications invited <span className="font-semibold">online</span> for hostel accommodation from regular full time students of the University. </p>

          <p className="mt-2 text-center text-blue-700 font-semibold underline cursor-pointer">
            Student Hostel Facilities
          </p>

          <hr className="my-4 border-gray-300" />
        </section>
      </main>
    </div>
  );
};

export default RegHeader;
