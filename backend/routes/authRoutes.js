const express = require("express");
const router = express.Router();
const {
  sendOTP,

  verifyOtp, // Import verifyOtp
  checkHostelEligibility,
  signUp,
  login,
  provostLogin,
  chiefProvostLogin,
  checkEmail,
  verificationStatus,
  createOrUpdateStudentProfile
} = require("../controllers/Auth");

// =======================
// Student Routes
// =======================

// Send OTP
router.post("/send-otp", sendOTP);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Check email existence
router.post("/check-email", checkEmail);

// Check verification status
router.post("/verification-status", verificationStatus);

// Verify OTP
router.post("/verify-otp", verifyOtp); // Add this route

// Check eligibility before signup
router.post("/check-eligibility", checkHostelEligibility);

// Student signup (after eligibility check)
router.post("/signup", signUp);

// Student login
router.post("/login", login);

// Create or update student profile (after user registration)
router.post("/student-profile", createOrUpdateStudentProfile);

// Provost login
router.post("/login-provost", provostLogin);

// Chief Provost login
router.post("/login-chief-provost", chiefProvostLogin);

module.exports = router;
