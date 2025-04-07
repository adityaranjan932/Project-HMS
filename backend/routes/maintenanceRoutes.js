const express = require("express");
const { submitMaintenanceRequest, getUserMaintenanceRequests } = require("../controllers/maintenanceController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Submit a maintenance request
router.post("/", auth, submitMaintenanceRequest);

// Get maintenance requests for the logged-in user
router.get("/my", auth, getUserMaintenanceRequests);

module.exports = router;
