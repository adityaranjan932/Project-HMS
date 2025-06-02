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
      <div className="bg-gray-100 min-h-screen">
        <div>
          <CarouselSlider />
        </div>

        {/* Features Section */}
        <div className="py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-bed text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Hostel Accommodation
              </h3>
              <p className="text-gray-600">
                Find comfortable and secure accommodations in our hostels,
                designed to provide a conducive environment for learning and
                living.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-utensils text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Mess Facilities
              </h3>
              <p className="text-gray-600">
                Enjoy nutritious and hygienic meals at our mess facilities,
                catering to diverse dietary preferences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-user-graduate text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Student Services
              </h3>
              <p className="text-gray-600">
                Access a range of student services, including online
                applications, fee payments, and grievance redressal.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-book text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Rules & Regulations
              </h3>
              <p className="text-gray-600">
                Stay informed about hostel rules and regulations to ensure a
                harmonious living experience for all residents.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-hands-helping text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Support Services
              </h3>
              <p className="text-gray-600">
                Our support team is here to assist you with any issues or
                queries related to hostel management.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
              <i className="fa-solid fa-link text-red-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Quick Links
              </h3>
              <p className="text-gray-600">
                Access important links and resources, including medical
                insurance, faculty login, and student search.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-200 py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-lg mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-300">
              <p className="italic text-gray-700 mb-6 text-lg">
                "The hostel facilities at the University of Lucknow are
                excellent. The rooms are spacious, and the environment is
                perfect for studying."
              </p>
              <h4 className="font-bold text-red-700 text-right">
                – Anjali Sharma
              </h4>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-300">
              <p className="italic text-gray-700 mb-6 text-lg">
                "I appreciate the cleanliness and hygiene maintained in the
                mess. The food is always fresh and delicious."
              </p>
              <h4 className="font-bold text-red-700 text-right">
                – Ravi Kumar
              </h4>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-300">
              <p className="italic text-gray-700 mb-6 text-lg">
                "The online services have made it so easy to manage
                hostel-related tasks. Great initiative by the university!"
              </p>
              <h4 className="font-bold text-red-700 text-right">
                – Priya Singh
              </h4>
            </div>
          </div>
        </div>

        {/* Call-to-Actions Section */}
        <div className="bg-gray-400 text-white py-12 px-6 text-center">
          <h2 className="text-xl font-bold mb-4">Ready to Join?</h2>
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-red-700 font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Register Now
          </Link>
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-[20px] px-[30px] flex justify-between items-center flex-wrap gap-y-[20px] ">
          © {new Date().getFullYear()} University of Lucknow - Hostel Management
          System.
        </footer>
      </div>

      <Footer />
    </>
  );
};

export default Home;
