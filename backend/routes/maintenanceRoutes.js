const express = require("express");
const { createMaintenanceRequest, getUserMaintenanceRequests } = require("../controllers/maintenanceController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createMaintenanceRequest);
router.get("/my", auth, getUserMaintenanceRequests);

module.exports = router;
