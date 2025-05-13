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
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <FiAlertTriangle className="text-6xl text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-900 mb-2">
          Facility Not Found
        </h1>
        <p className="text-xl text-gray-600 text-center">
          Sorry, we couldn't find the facility details you're looking for.
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors flex items-center"
        >
          <FiChevronLeft className="mr-2" /> Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="text-red-600 hover:text-red-800 flex items-center mb-6 text-sm"
          >
            <FiChevronLeft className="mr-1" /> Back to Home
          </Link>

          <header className="mb-8 pb-4 border-b-2 border-red-200">
            <h1 className="text-4xl font-extrabold text-red-800 sm:text-5xl">
              {facility.name}
            </h1>
          </header>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {facility.imageUrl &&
              facility.imageUrl !== "/images/facilities/placeholder.jpg" && (
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-64 md:h-96 object-cover"
                />
              )}
            <div className="p-6 md:p-10">
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {facility.description}
              </p>

              {facility.id === "mess-canteen" && facility.details && (
                <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-2xl font-semibold text-red-700 mb-4">
                    Mess & Canteen Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-1">
                        Mess Timings:
                      </h4>
                      <p>
                        Breakfast: {facility.details.messTimings?.breakfast}
                      </p>
                      <p>Lunch: {facility.details.messTimings?.lunch}</p>
                      <p>Dinner: {facility.details.messTimings?.dinner}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-1">
                        Canteen Timings:
                      </h4>
                      <p>{facility.details.canteenTimings}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-600 mb-1">
                      Menu Highlights:
                    </h4>
                    <ul className="list-disc list-inside ml-4">
                      {facility.details.menuHighlights?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-600 mb-1">
                      Payment Options:
                    </h4>
                    <ul className="list-disc list-inside ml-4">
                      {facility.details.paymentOptions?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {facility.id === "laundry-services" && facility.details && (
                <div className="mb-8 p-6 bg-sky-50 rounded-lg border border-sky-200">
                  <h3 className="text-2xl font-semibold text-sky-700 mb-4">
                    Laundry Service Details
                  </h3>
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
                    <span className="font-semibold text-sky-600">Charges:</span>{" "}
                    {facility.details.charges}
                  </p>
                  <p>
                    <span className="font-semibold text-sky-600">
                      Ironing Services:
                    </span>{" "}
                    {facility.details.ironingServices}
                  </p>
                </div>
              )}

              {facility.id === "sports-gym" && facility.details && (
                <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-2xl font-semibold text-green-700 mb-4">
                    Sports & Gym Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-1">
                        Outdoor Sports:
                      </h4>
                      <ul className="list-disc list-inside ml-4">
                        {facility.details.outdoorSports?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 mb-1">
                        Indoor Sports:
                      </h4>
                      <ul className="list-disc list-inside ml-4">
                        {facility.details.indoorSports?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-1">
                      Gym Timings:
                    </h4>
                    <p>{facility.details.gymTimings}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-1">
                      Gym Equipment:
                    </h4>
                    <ul className="list-disc list-inside ml-4">
                      {facility.details.gymEquipment?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {facility.id === "reading-room" && facility.details && (
                <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="text-2xl font-semibold text-yellow-700 mb-4">
                    Reading Room Details
                  </h3>
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
                  <div>
                    <h4 className="font-semibold text-yellow-600 mt-2 mb-1">
                      Resources:
                    </h4>
                    <ul className="list-disc list-inside ml-4">
                      {facility.details.resources?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {facility.id === "wifi-information" && facility.details && (
                <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                    Wi-Fi Information
                  </h3>
                  <p>
                    <span className="font-semibold text-indigo-600">
                      Network Name (SSID):
                    </span>{" "}
                    {facility.details.networkName}
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
                    {facility.details.supportContact}
                  </p>
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
