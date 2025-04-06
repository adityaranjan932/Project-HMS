const express = require("express");
const router = express.Router();

const {
  sendOTP,
  checkHostelEligibility,
  signUp,
  login,
  provostLogin,
  chiefProvostLogin,
} = require("../controllers/Auth");

// =======================
// Student Routes
// =======================

// Send OTP
router.post("/send-otp", sendOTP);

// Check eligibility before signup
router.post("/check-eligibility", checkHostelEligibility);

// Student signup (after eligibility check)
router.post("/signup", signUp);

// Student login
router.post("/login", login);


// =======================
// Provost Routes
// =======================

// Provost login
router.post("/login-provost", provostLogin);

// Chief Provost login
router.post("/login-chief-provost", chiefProvostLogin);

module.exports = router;
