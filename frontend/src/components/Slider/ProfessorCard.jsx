import React from "react";

const ProfessorCard = ({ name, title, imgSrc, profileLink, messageLink }) => (
  <div className="bg-white p-3 lg:p-4 rounded-lg shadow-md text-center border border-gray-200 hover:shadow-lg transition-shadow">
    <img
      src={imgSrc}
      alt={name}
      className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full mx-auto mb-2 lg:mb-3 object-cover border-2 border-red-700"
    />
    <h4 className="text-sm lg:text-md font-semibold text-red-800 leading-tight">{name}</h4>
    <p className="text-xs text-gray-600 mb-2 lg:mb-3 px-1 lg:px-2 leading-snug">{title}</p>
    <div className="flex justify-around mt-2 gap-1 lg:gap-2">
      <a
        href={profileLink}
        className="bg-yellow-500 text-xs text-red-900 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-md hover:bg-yellow-600 transition-colors font-medium flex-1 text-center"
      >
        PROFILE
      </a>
      <a
        href={messageLink}
        className="bg-yellow-500 text-xs text-red-900 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-md hover:bg-yellow-600 transition-colors font-medium flex-1 text-center"
      >
        MESSAGE
      </a>
    </div>
  </div>
);

export default ProfessorCard;
