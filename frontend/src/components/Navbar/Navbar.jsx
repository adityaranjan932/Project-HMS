import React from "react";
import { Link } from "react-router-dom"; // Use Link for routing
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-y-rose-600 border-2">
        <div className="container-fluid flex justify-evenly items-center">
          <Link className="navbar-brand flex justify-items-start" to="/">
            <img
              src="/logo.png"
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            HMS
          </Link>
          <div className="flex" id="navbarNav">
            <ul className="navbar-nav flex flex-row justify-evenly items-center gap-4">
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={`nav-link ${
                      item.name === "Home" ? "active" : ""
                    }`}
                    to={item.to}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
