import React from "react";
import { useParams } from "react-router-dom";
import rulesData from "../../../utils/RulesAndRegulations.json";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiList } from "react-icons/fi"; // Example icons
import Navbar from "../../components/Navbar/Navbar";

const RuleDetailsPage = () => {
  const { ruleId } = useParams();
  const rule = rulesData.find((r) => r.id === ruleId);

  if (!rule) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FiAlertTriangle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Rule Not Found
        </h1>
        <p className="text-gray-600">
          The rule you are looking for does not exist or may have been moved.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {rule.imageUrl && (
            <img
              src={rule.imageUrl}
              alt={rule.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-red-800 mb-4 flex items-center">
              <FiInfo className="mr-3 text-red-700" /> {rule.name}
            </h1>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {rule.description}
            </p>

            {rule.details && rule.details.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                  <FiList className="mr-2 text-red-600" /> Key Points
                </h2>
                <ul className="list-none space-y-2 pl-0">
                  {rule.details.map((detail, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <FiCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-8">
              Please adhere to all hostel rules and regulations to ensure a safe
              and comfortable living environment for everyone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RuleDetailsPage;
