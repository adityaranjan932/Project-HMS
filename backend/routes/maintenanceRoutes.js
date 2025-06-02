const express = require("express");
const { submitMaintenanceRequest, getUserMaintenanceRequests, getAllMaintenanceRequests } = require("../controllers/maintenanceController");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

// Submit a maintenance request
router.post("/", auth, submitMaintenanceRequest);

// Get maintenance requests for the logged-in user
router.get("/my", auth, getUserMaintenanceRequests);

// Get all maintenance requests (for Provost)
router.get("/", auth, isProvost, getAllMaintenanceRequests);

module.exports = router;
