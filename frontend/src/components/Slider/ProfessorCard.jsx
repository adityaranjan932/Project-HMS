import React from "react";

const ProfessorCard = ({ name, title, imgSrc, email }) => (
  <div className="bg-white p-3 lg:p-4 rounded-lg shadow-md text-center border border-gray-200 hover:shadow-lg transition-shadow">
    <img
      src={imgSrc}
      alt={name}
      className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full mx-auto mb-2 lg:mb-3 object-cover border-2 border-red-700"
    />
    <h4 className="text-sm lg:text-md font-semibold text-red-800 leading-tight">
      {name}
    </h4>
    <p className="text-xs text-gray-600 mb-2 lg:mb-3 px-1 lg:px-2 leading-snug">
      {title}
    </p>
    <div className="mt-2">
      <a
        href={`mailto:${email}`}
        className="bg-red-700 text-xs text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-md hover:bg-red-800 transition-colors font-medium inline-flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        Email
      </a>
    </div>
  </div>
);

export default ProfessorCard;
