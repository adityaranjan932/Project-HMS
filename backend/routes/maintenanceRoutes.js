const express = require("express");
const { submitMaintenanceRequest, getUserMaintenanceRequests, getAllMaintenanceRequests, resolveMaintenanceRequest } = require("../controllers/maintenanceController");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

// Submit a maintenance request
router.post("/", auth, submitMaintenanceRequest);

// Get maintenance requests for the logged-in user
router.get("/my", auth, getUserMaintenanceRequests);

// Get all maintenance requests (for provost)
router.get("/all", auth, isProvost, getAllMaintenanceRequests);

// Resolve a maintenance request (for provost)
router.put("/resolve/:requestId", auth, isProvost, resolveMaintenanceRequest);

module.exports = router;
