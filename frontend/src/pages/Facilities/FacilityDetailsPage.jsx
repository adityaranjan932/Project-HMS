// filepath: e:\coding\website\Project-HMS\frontend\src\pages\Facilities\FacilityDetailsPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import facilityData from "../../../utils/StudentFacilities.json";
import { FiAlertTriangle, FiChevronLeft } from "react-icons/fi";
import Navbar from "../../components/Navbar/Navbar";

const FacilityDetailsPage = () => {
  const { facilityId } = useParams();
  const facility = facilityData.find((f) => f.id === facilityId);
  if (!facility) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <FiAlertTriangle className="text-4xl sm:text-5xl lg:text-6xl text-red-500 mb-3 sm:mb-4" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-900 mb-2 text-center">
          Facility Not Found
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center px-4 max-w-md">
          Sorry, we couldn't find the facility details you're looking for.
        </p>
        <Link
          to="/"
          className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors flex items-center text-sm sm:text-base"
        >
          <FiChevronLeft className="mr-2" /> Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
        <div className="max-w-4xl xl:max-w-5xl mx-auto">
          <Link
            to="/"
            className="text-red-600 hover:text-red-800 flex items-center mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base transition-colors duration-200"
          >
            <FiChevronLeft className="mr-1 text-sm sm:text-base" /> Back to Home
          </Link>

          <header className="mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-2 border-red-200">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-red-800 leading-tight">
              {facility.name}
            </h1>
          </header>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl overflow-hidden">
            {facility.imageUrl &&
              facility.imageUrl !== "/images/facilities/placeholder.jpg" && (
                <div className="relative">
                  <img
                    src={facility.imageUrl}
                    alt={facility.name}
                    className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
              {" "}
              <p className="text-gray-700 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
                {facility.description}
              </p>
              {facility.id === "mess-canteen" && facility.details && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-xl sm:text-2xl font-semibold text-red-700 mb-3 sm:mb-4">
                    Mess & Canteen Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-gray-700">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600 mb-2 text-sm sm:text-base">
                        Mess Timings:
                      </h4>
                      <div className="space-y-1 text-sm sm:text-base">
                        <p>
                          <span className="font-medium">Breakfast:</span>{" "}
                          {facility.details.messTimings?.breakfast}
                        </p>
                        <p>
                          <span className="font-medium">Lunch:</span>{" "}
                          {facility.details.messTimings?.lunch}
                        </p>
                        <p>
                          <span className="font-medium">Dinner:</span>{" "}
                          {facility.details.messTimings?.dinner}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600 mb-2 text-sm sm:text-base">
                        Canteen Timings:
                      </h4>
                      <p className="text-sm sm:text-base">
                        {facility.details.canteenTimings}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-red-600 mb-2 text-sm sm:text-base">
                      Menu Highlights:
                    </h4>
                    <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                      {facility.details.menuHighlights?.map((item, idx) => (
                        <li key={idx} className="text-sm sm:text-base">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-red-600 mb-2 text-sm sm:text-base">
                      Payment Options:
                    </h4>
                    <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                      {facility.details.paymentOptions?.map((item, idx) => (
                        <li key={idx} className="text-sm sm:text-base">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {facility.id === "laundry-services" && facility.details && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-sky-50 rounded-lg border border-sky-200">
                  <h3 className="text-xl sm:text-2xl font-semibold text-sky-700 mb-3 sm:mb-4">
                    Laundry Service Details
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold text-sky-600">
                        Service Hours:
                      </span>{" "}
                      {facility.details.serviceHours}
                    </p>
                    <p>
                      <span className="font-semibold text-sky-600">
                        Token System:
                      </span>{" "}
                      {facility.details.tokenSystem}
                    </p>
                    <p>
                      <span className="font-semibold text-sky-600">
                        Charges:
                      </span>{" "}
                      {facility.details.charges}
                    </p>
                    <p>
                      <span className="font-semibold text-sky-600">
                        Ironing Services:
                      </span>{" "}
                      {facility.details.ironingServices}
                    </p>
                  </div>
                </div>
              )}
              {facility.id === "sports-gym" && facility.details && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-xl sm:text-2xl font-semibold text-green-700 mb-3 sm:mb-4">
                    Sports & Gym Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">
                        Outdoor Sports:
                      </h4>
                      <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                        {facility.details.outdoorSports?.map((item, idx) => (
                          <li key={idx} className="text-sm sm:text-base">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">
                        Indoor Sports:
                      </h4>
                      <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                        {facility.details.indoorSports?.map((item, idx) => (
                          <li key={idx} className="text-sm sm:text-base">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">
                      Gym Timings:
                    </h4>
                    <p className="text-sm sm:text-base">
                      {facility.details.gymTimings}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">
                      Gym Equipment:
                    </h4>
                    <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                      {facility.details.gymEquipment?.map((item, idx) => (
                        <li key={idx} className="text-sm sm:text-base">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {facility.id === "reading-room" && facility.details && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="text-xl sm:text-2xl font-semibold text-yellow-700 mb-3 sm:mb-4">
                    Reading Room Details
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold text-yellow-600">
                        Operating Hours:
                      </span>{" "}
                      {facility.details.operatingHours}
                    </p>
                    <p>
                      <span className="font-semibold text-yellow-600">
                        Capacity:
                      </span>{" "}
                      {facility.details.capacity}
                    </p>
                    <p>
                      <span className="font-semibold text-yellow-600">
                        Environment:
                      </span>{" "}
                      {facility.details.environment}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold text-yellow-600 mb-2 text-sm sm:text-base">
                      Resources:
                    </h4>
                    <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                      {facility.details.resources?.map((item, idx) => (
                        <li key={idx} className="text-sm sm:text-base">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {facility.id === "wifi-information" && facility.details && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-3 sm:mb-4">
                    Wi-Fi Information
                  </h3>
                  <div className="space-y-3 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold text-indigo-600">
                        Network Name (SSID):
                      </span>{" "}
                      <code className="bg-indigo-100 px-2 py-1 rounded text-indigo-800 font-mono text-xs sm:text-sm">
                        {facility.details.networkName}
                      </code>
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-600">
                        Access Instructions:
                      </span>{" "}
                      {facility.details.accessInstructions}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-600">
                        Coverage:
                      </span>{" "}
                      {facility.details.coverage}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-600">
                        Support Contact:
                      </span>{" "}
                      <a
                        href={`tel:${facility.details.supportContact}`}
                        className="text-indigo-700 hover:text-indigo-800 underline"
                      >
                        {facility.details.supportContact}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacilityDetailsPage;
