import React from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import CarouselSlider from "../../components/Slider/CarouselSlider";

import { Link } from "react-router-dom";

const Home = () => {
  const animationOrder = ["left", "up", "down", "right"];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Hero Carousel Section */}
        <div className="relative">
          <CarouselSlider />
        </div>

        {/* Features Section */}
        <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
              Our Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-bed text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Hostel Accommodation
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Find comfortable and secure accommodations in our hostels,
                  designed to provide a conducive environment for learning and
                  living.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-utensils text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Mess Facilities
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Enjoy nutritious and hygienic meals at our mess facilities,
                  catering to diverse dietary preferences.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-user-graduate text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Student Services
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Access a range of student services, including online
                  applications, fee payments, and grievance redressal.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-book text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Rules & Regulations
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Stay informed about hostel rules and regulations to ensure a
                  harmonious living experience for all residents.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-hands-helping text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Support Services
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Our support team is here to assist you with any issues or
                  queries related to hostel management.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                <i className="fa-solid fa-link text-red-700 text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6"></i>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">
                  Quick Links
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Access important links and resources, including medical
                  insurance, faculty login, and student search.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
              What Our Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border border-gray-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <p className="italic text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                  "The hostel facilities at the University of Lucknow are
                  excellent. The rooms are spacious, and the environment is
                  perfect for studying."
                </p>
                <h4 className="font-bold text-red-700 text-right text-sm sm:text-base">
                  – Anjali Sharma
                </h4>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border border-gray-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <p className="italic text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                  "I appreciate the cleanliness and hygiene maintained in the
                  mess. The food is always fresh and delicious."
                </p>
                <h4 className="font-bold text-red-700 text-right text-sm sm:text-base">
                  – Ravi Kumar
                </h4>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border border-gray-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <p className="italic text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                  "The online services have made it so easy to manage
                  hostel-related tasks. Great initiative by the university!"
                </p>
                <h4 className="font-bold text-red-700 text-right text-sm sm:text-base">
                  – Priya Singh
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Actions Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
              Ready to Join?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Start your journey with us and experience the best hostel
              management services
            </p>
            <Link
              to="/register"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Register Now
            </Link>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs sm:text-sm lg:text-base">
              © {new Date().getFullYear()} University of Lucknow - Hostel
              Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      <Footer />
    </>
  );
};

export default Home;
