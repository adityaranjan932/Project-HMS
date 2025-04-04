const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    loginProvost,
    loginChiefProvost
} = require("../controllers/Auth");

// Student routes
router.post("/signup", signup);
router.post("/login", login);

// Provost routes
router.post("/provost-login", loginProvost);

// Chief Provost routes
router.post("/chief-provost-login", loginChiefProvost);

module.exports = router;
