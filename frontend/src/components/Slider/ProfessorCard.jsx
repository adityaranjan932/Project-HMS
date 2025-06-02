import React from "react";

const ProfessorCard = ({ name, title, imgSrc, profileLink, messageLink }) => (
  <div className="bg-white p-3 rounded-lg shadow-md text-center border border-gray-200">
    <img
      src={imgSrc}
      alt={name}
      className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-red-700"
    />
    <h4 className="text-md font-semibold text-red-800">{name}</h4>
    <p className="text-xs text-gray-600 mb-3 px-2">{title}</p>
    <div className="flex justify-around mt-2">
      <a
        href={profileLink}
        className="bg-yellow-500 text-xs text-red-900 px-4 py-1.5 rounded-md hover:bg-yellow-600 transition-colors font-medium"
      >
        PROFILE
      </a>
      <a
        href={messageLink}
        className="bg-yellow-500 text-xs text-red-900 px-4 py-1.5 rounded-md hover:bg-yellow-600 transition-colors font-medium"
      >
        MESSAGE
      </a>
    </div>
  </div>
);

export default ProfessorCard;
