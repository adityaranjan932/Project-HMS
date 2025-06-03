const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOtp, // Import verifyOtp
  checkHostelEligibility,
  emailVerification, // Renamed from signUp
  login,
  provostLogin,
  chiefProvostLogin,
  checkEmail,
  verificationStatus,
  createOrUpdateRegisteredStudentProfile,
  getAllRegisteredStudentProfiles,
  logout,
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  resetPassword
} = require("../controllers/Auth");

// Import auth middleware
const { auth } = require("../middleware/auth");

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
router.post("/email-verification", emailVerification);

// Student login
router.post("/login", login);

// Create or update student profile (after user registration)
router.post("/registered-student-profile", createOrUpdateRegisteredStudentProfile);

// Provost login
router.post("/login-provost", provostLogin);

// Chief Provost login
router.post("/login-chief-provost", chiefProvostLogin);

// Get all student profiles
router.get("/registered-students", getAllRegisteredStudentProfiles);

// Logout route for both students and provosts (requires authentication)
router.post("/logout", auth, logout);

// =======================
// Reset Password Routes (Students Only)
// =======================

// Send reset password OTP
router.post("/send-reset-password-otp", sendResetPasswordOTP);

// Verify reset password OTP
router.post("/verify-reset-password-otp", verifyResetPasswordOTP);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;
