const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Middleware to check if the user is authenticated
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded token to request
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// Middleware for Student-only routes
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Students only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

// Middleware for Provost-only routes
exports.isProvost = async (req, res, next) => {
  try {
    if (req.user.role !== "provost") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Provosts only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

// Middleware for Chief Provost-only routes
exports.isChiefProvost = async (req, res, next) => {
  try {
    if (req.user.role !== "chiefProvost") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Chief Provosts only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

// Middleware for Provost or Admin
exports.isProvostOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "provost" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Provosts or Admins only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};
