import React from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import hostelDataAll from "../../../utils/HostelDetails.json";
import {
  FiMapPin,
  FiUsers,
  FiHome,
  FiCheckCircle,
  FiAlertTriangle,
  FiPhone,
  FiMail,
} from "react-icons/fi"; // Added FiPhone, FiMail
import Navbar from "../../components/Navbar/Navbar";

const HostelDetailsPage = () => {
  const { hostelId } = useParams();
  const hostel = hostelDataAll.find((h) => h.hostelId === hostelId);
  if (!hostel) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 px-4 sm:py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <FiAlertTriangle className="text-4xl sm:text-5xl lg:text-6xl text-red-500 mb-3 sm:mb-4" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-900 mb-2 text-center">
          Hostel Not Found
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center max-w-md px-4">
          Sorry, we couldn\'t find the hostel you\'re looking for.
        </p>
        <Link
          to="/"
          className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-red-700 text-white text-sm sm:text-base rounded-md hover:bg-red-800 transition-colors w-auto"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  // Split description into paragraphs
  const descriptionParagraphs = hostel.description
    ? hostel.description.split("\n\n")
    : [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
          <Link to="/" className="hover:text-red-700 transition-colors">
            Home
          </Link>{" "}
          <span className="mx-1">/</span>
          <span className="font-semibold text-red-700 break-words">
            {hostel.HostelName}
          </span>
        </div>

        <header className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-red-800 border-b-2 border-red-200 pb-2 sm:pb-3 break-words">
            {hostel.HostelName}
          </h1>
        </header>

        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8">
          {/* Main Hostel Details */}
          <div className="mb-6 sm:mb-8 prose prose-red prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed">
            {descriptionParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="order-1 lg:order-1">
              <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-3 border-b pb-1">
                Key Information
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start sm:items-center text-sm sm:text-base">
                  <FiMapPin className="mr-2 sm:mr-3 text-red-600 text-base sm:text-lg mt-0.5 sm:mt-0 flex-shrink-0" />
                  <span className="break-words">
                    Location:{" "}
                    <span className="font-medium">{hostel.location}</span>
                  </span>
                </p>
                <p className="flex items-start sm:items-center text-sm sm:text-base">
                  <FiUsers className="mr-2 sm:mr-3 text-red-600 text-base sm:text-lg mt-0.5 sm:mt-0 flex-shrink-0" />
                  <span>
                    For:{" "}
                    <span className="capitalize font-medium">
                      {hostel.hostelFor}
                    </span>{" "}
                    Students
                  </span>
                </p>
                <p className="flex items-start sm:items-center text-sm sm:text-base">
                  <FiHome className="mr-2 sm:mr-3 text-red-600 text-base sm:text-lg mt-0.5 sm:mt-0 flex-shrink-0" />
                  <span>
                    Capacity:{" "}
                    <span className="font-medium">
                      {hostel["Total-Capacity"]}
                    </span>
                  </span>
                </p>
              </div>
            </div>
            <div className="order-2 lg:order-2">
              <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-3 border-b pb-1">
                Room Types
              </h3>
              <ul className="list-disc list-inside pl-2 text-gray-700 space-y-1.5 text-sm sm:text-base">
                {hostel["No-of-rooms"].singleSeater > 0 && (
                  <li>
                    Single Seater:{" "}
                    <span className="font-medium">
                      {hostel["No-of-rooms"].singleSeater}
                    </span>
                  </li>
                )}
                {hostel["No-of-rooms"].doubleSeater > 0 && (
                  <li>
                    Double Seater:{" "}
                    <span className="font-medium">
                      {hostel["No-of-rooms"].doubleSeater}
                    </span>
                  </li>
                )}
                {hostel["No-of-rooms"].tripleSeater > 0 && (
                  <li>
                    Triple Seater:{" "}
                    <span className="font-medium">
                      {hostel["No-of-rooms"].tripleSeater}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-3 border-b pb-1">
              Facilities
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {hostel.facilities.map((facility, index) => (
                <li
                  key={index}
                  className="flex items-center bg-red-50 text-red-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <FiCheckCircle className="mr-1 sm:mr-2 text-red-500 flex-shrink-0" />
                  <span className="capitalize break-words">{facility}</span>
                </li>
              ))}
            </ul>
          </div>{" "}
          {/* Administration Section */}
          {hostel.administration && hostel.administration.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-800 mb-4 sm:mb-6 border-b-2 border-red-200 pb-2">
                Administration
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {hostel.administration.map((staff, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {staff.imageUrl &&
                      staff.imageUrl !== "/path/to/image.jpg" && (
                        <div className="flex justify-center md:justify-start mb-4 md:mb-0 md:mr-6">
                          <img
                            src={staff.imageUrl}
                            alt={staff.name}
                            className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-full object-cover shadow-sm border-2 border-red-100"
                          />
                        </div>
                      )}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-700 mb-1">
                        {staff.name}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium mb-1">
                        {staff.role}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-1">
                        {staff.department}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-2 break-words">
                        {staff.university}, {staff.campus}
                      </p>

                      <div className="space-y-1 sm:space-y-2">
                        {staff.mobile && (
                          <p className="text-xs sm:text-sm lg:text-base text-gray-500 flex items-center justify-center md:justify-start">
                            <FiPhone className="mr-2 text-red-500 flex-shrink-0" />
                            <a
                              href={`tel:${staff.mobile}`}
                              className="hover:text-red-600 transition-colors break-all"
                            >
                              {staff.mobile}
                            </a>
                          </p>
                        )}
                        {staff.email && (
                          <p className="text-xs sm:text-sm lg:text-base text-gray-500 flex items-center justify-center md:justify-start">
                            <FiMail className="mr-2 text-red-500 flex-shrink-0" />
                            <a
                              href={`mailto:${staff.email}`}
                              className="hover:text-red-600 transition-colors break-all"
                            >
                              {staff.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HostelDetailsPage;
