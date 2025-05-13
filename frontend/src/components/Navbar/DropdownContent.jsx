import React from "react";
import { Link } from "react-router-dom";

// Optimized DropdownContent Component
const DropdownContent = ({
  item,
  isMobile,
  allHostelData, // Changed from hostels, selectedCampus, setSelectedCampus
  onItemClick,
}) => {
  const handleLinkClick = () => {
    if (onItemClick) onItemClick(isMobile);
  };

  if (item.name === "Hostels") {
    const oldCampusHostels = allHostelData.filter(
      (h) => h.location === "Old Campus"
    );
    const newCampusHostels = allHostelData.filter(
      (h) => h.location === "New Campus"
    );

    const campusSectionClasses = isMobile ? "py-2" : "px-4 py-2";
    const campusTitleClasses =
      "text-xs font-semibold mb-1 uppercase tracking-wider " +
      (isMobile ? "text-red-300" : "text-gray-400");
    const linkClasses = `block py-1 text-sm ${
      isMobile
        ? "hover:bg-red-700 rounded-md pl-2"
        : "hover:bg-gray-100 rounded-md px-2"
    }`;

    return (
      <div className={isMobile ? "px-0" : ""}>
        {oldCampusHostels.length > 0 && (
          <div className={campusSectionClasses}>
            <h4 className={campusTitleClasses}>Old Campus</h4>
            {oldCampusHostels.map((hostel) => (
              <Link
                key={hostel.hostelId}
                to={`/hostel/${hostel.hostelId}`}
                onClick={handleLinkClick}
                className={linkClasses}
              >
                {isMobile ? "- " : ""}
                {hostel.HostelName}
              </Link>
            ))}
          </div>
        )}
        {newCampusHostels.length > 0 && (
          <div className={campusSectionClasses}>
            <h4 className={campusTitleClasses}>New Campus</h4>
            {newCampusHostels.map((hostel) => (
              <Link
                key={hostel.hostelId}
                to={`/hostel/${hostel.hostelId}`}
                onClick={handleLinkClick}
                className={linkClasses}
              >
                {isMobile ? "- " : ""}
                {hostel.HostelName}
              </Link>
            ))}
          </div>
        )}
        {oldCampusHostels.length === 0 && newCampusHostels.length === 0 && (
          <p
            className={`px-4 py-2 text-sm ${
              isMobile ? "text-red-200" : "text-gray-500"
            }`}
          >
            No hostels listed.
          </p>
        )}
      </div>
    );
  }

  // Other Dropdown Items
  return (
    <div>
      {(item.items || []).map((subItem, i) => {
        if (subItem.external) {
          return (
            <a
              key={subItem.name || i}
              href={subItem.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className={`block px-4 py-2 text-sm ${
                isMobile ? "hover:bg-red-700 rounded-md" : "hover:bg-gray-100"
              }`}
            >
              {isMobile ? "- " : ""}
              {subItem.name || subItem}
            </a>
          );
        }
        return (
          <Link
            key={subItem.id || i}
            to={subItem.to || "#"}
            onClick={handleLinkClick}
            className={`block px-4 py-2 text-sm ${
              isMobile ? "hover:bg-red-700 rounded-md" : "hover:bg-gray-100"
            }`}
          >
            {isMobile ? "- " : ""}
            {subItem.name || subItem}
          </Link>
        );
      })}
    </div>
  );
};

export default DropdownContent;
