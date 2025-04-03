import React from "react";
import { useNavigate } from "react-router-dom"; // Added import for useNavigate
import UniversityBanner from "../Banner/UniversityBanner";

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const navItems = [
    { name: "Home", href: "#home", isActive: true },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Fees", href: "#pricing" },
    { name: "Login", href: "#login" },
    { name: "Register", href: "/register" }, // Updated href for Register
  ];

  return (
    <>
      <UniversityBanner />
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-y-rose-600 border-2">
        <div className="container-fluid flex justify-evenly items-center">
          <a className="navbar-brand flex justify-items-start" href="#">
            <img
              src="/logo.png"
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            HMS
          </a>
          <div className="flex" id="navbarNav">
            <ul className="navbar-nav flex flex-row justify-evenly items-center gap-4">
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  {item.name === "Login" || item.name === "Register" ? (
                    <button
                      className={`btn bg-amber-400 border-2 p-1 rounded-md ${
                        item.name === "Login" ? "btn-primary" : "btn-secondary"
                      }`}
                      onClick={() =>
                        item.name === "Register"
                          ? navigate(item.href) // Navigate to Register page
                          : (window.location.href = item.href)
                      }
                    >
                      {item.name}
                    </button>
                  ) : (
                    <a
                      className={`nav-link ${item.isActive ? "active" : ""}`}
                      aria-current={item.isActive ? "page" : undefined}
                      href={item.href}
                    >
                      {item.name}
                    </a>
                  )}
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
