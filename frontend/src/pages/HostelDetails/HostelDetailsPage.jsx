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
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <FiAlertTriangle className="text-6xl text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-900 mb-2">
          Hostel Not Found
        </h1>
        <p className="text-xl text-gray-600 text-center">
          Sorry, we couldn\'t find the hostel you\'re looking for.
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs (Optional, similar to image) */}
        <div className="max-w-7xl mx-auto mb-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-red-700">
            Home
          </Link>{" "}
          /
          <span className="font-semibold text-red-700">
            {hostel.HostelName}
          </span>
        </div>

        <header className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-red-800 sm:text-4xl border-b-2 border-red-200 pb-2">
            {hostel.HostelName}
          </h1>
        </header>

        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          {/* Main Hostel Details */}
          <div className="mb-8 prose prose-red max-w-none text-gray-700 leading-relaxed">
            {descriptionParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-red-700 mb-3 border-b pb-1">
                Key Information
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center">
                  <FiMapPin className="mr-3 text-red-600 text-lg" /> Location:{" "}
                  <span className="font-medium ml-1">{hostel.location}</span>
                </p>
                <p className="flex items-center">
                  <FiUsers className="mr-3 text-red-600 text-lg" /> For:{" "}
                  <span className="capitalize font-medium ml-1">
                    {hostel.hostelFor}
                  </span>{" "}
                  Students
                </p>
                <p className="flex items-center">
                  <FiHome className="mr-3 text-red-600 text-lg" /> Capacity:{" "}
                  <span className="font-medium ml-1">
                    {hostel["Total-Capacity"]}
                  </span>{" "}
                  Students
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-700 mb-3 border-b pb-1">
                Room Types
              </h3>
              <ul className="list-disc list-inside pl-2 text-gray-700 space-y-1.5">
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

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-red-700 mb-3 border-b pb-1">
              Facilities
            </h3>
            <ul className="flex flex-wrap gap-3">
              {hostel.facilities.map((facility, index) => (
                <li
                  key={index}
                  className="flex items-center bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-md border border-red-200"
                >
                  <FiCheckCircle className="mr-2 text-red-500" />
                  <span className="capitalize">{facility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Administration Section */}
          {hostel.administration && hostel.administration.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-6 border-b-2 border-red-200 pb-2">
                Administration
              </h2>
              <div className="space-y-8">
                {hostel.administration.map((staff, index) => (
                  <div
                    key={index}
                    className="md:flex bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    {staff.imageUrl &&
                      staff.imageUrl !== "/path/to/image.jpg" && (
                        <img
                          src={staff.imageUrl}
                          alt={staff.name}
                          className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover mx-auto md:mx-0 md:mr-6 mb-4 md:mb-0 shadow-sm"
                        />
                      )}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold text-red-700">
                        {staff.name}
                      </h3>
                      <p className="text-md text-gray-600 font-medium">
                        {staff.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {staff.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        {staff.university}, {staff.campus}
                      </p>
                      {staff.mobile && (
                        <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start mt-1">
                          <FiPhone className="mr-2 text-red-500" />{" "}
                          {staff.mobile}
                        </p>
                      )}
                      {staff.email && (
                        <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                          <FiMail className="mr-2 text-red-500" />{" "}
                          <a
                            href={`mailto:${staff.email}`}
                            className="hover:text-red-600"
                          >
                            {staff.email}
                          </a>
                        </p>
                      )}
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
