import React from "react";
import { Link } from "react-router-dom";
import UniversityBanner from "../Banner/UniversityBanner";

const Navbar = () => {
  const navItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/#about" },
    { name: "Contact", to: "/#contact" },
    { name: "Fees", to: "/#pricing" },
    { name: "Login", to: "/login" },
    { name: "Register", to: "/register" },
  ];

  return (
    <>
      <UniversityBanner />
      <nav className="navbar bg-white shadow-md border-b-2 border-rose-600">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link
            className="flex items-center text-rose-600 font-bold text-xl"
            to="/"
          >
            <img
              src="/logo.png"
              alt="Logo"
              width="40"
              height="40"
              className="mr-2"
            />
            HMS
          </Link>
          <div className="hidden md:flex" id="navbarNav">
            <ul className="flex space-x-6">
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={`nav-link text-gray-700 hover:text-rose-600 transition ${
                      item.name === "Home" ? "font-semibold text-rose-600" : ""
                    }`}
                    to={item.to}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button className="md:hidden text-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
