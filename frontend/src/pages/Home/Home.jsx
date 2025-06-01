import React from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import CarouselSlider from '../../components/Slider/CarouselSlider';

import { Link } from "react-router-dom";


const Home = () => {

const animationOrder = ["left", "up", "down", "right"];

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-[#F4F4F4	] text-white py-4 px-6 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">Welcome to the Hostel Management System</h1>
          <p className="text-lg max-w-full mx-auto text-gray-800">
            The official platform for managing hostel accommodations, facilities, and services
            at the University of Lucknow. Explore our hostels, access online services, and stay
            updated with the latest information.
          </p>
        </div>
        <CarouselSlider />

        {/* Features Section */}
        <div className="py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-bed text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Hostel Accommodation</h3>
              <p>
                Find comfortable and secure accommodations in our hostels, designed to provide
                a conducive environment for learning and living.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-utensils text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Mess Facilities</h3>
              <p>
                Enjoy nutritious and hygienic meals at our mess facilities, catering to diverse
                dietary preferences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-user-graduate text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Student Services</h3>
              <p>
                Access a range of student services, including online applications, fee payments,
                and grievance redressal.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-book text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Rules & Regulations</h3>
              <p>
                Stay informed about hostel rules and regulations to ensure a harmonious living
                experience for all residents.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-hands-helping text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Support Services</h3>
              <p>
                Our support team is here to assist you with any issues or queries related to
                hostel management.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fa-solid fa-link text-red-700 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
              <p>
                Access important links and resources, including medical insurance, faculty login,
                and student search.
              </p>
            </div>
          </div>
        </div>



        {/* Testimonials Section */}
        <div className="bg-gray-200 py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-lg mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="italic mb-4">
                "The hostel facilities at the University of Lucknow are excellent. The rooms are
                spacious, and the environment is perfect for studying."
              </p>
              <h4 className="font-bold">– Anjali Sharma</h4>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="italic mb-4">
                "I appreciate the cleanliness and hygiene maintained in the mess. The food is
                always fresh and delicious."
              </p>
              <h4 className="font-bold">– Ravi Kumar</h4>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="italic mb-4">
                "The online services have made it so easy to manage hostel-related tasks. Great
                initiative by the university!"
              </p>
              <h4 className="font-bold">– Priya Singh</h4>
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
          © {new Date().getFullYear()} University of Lucknow - Hostel Management System.
        </footer>
      </div>

      <Footer />
    </>
  );
};

export default Home;
