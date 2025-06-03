const express = require("express");
const { submitLeaveRequest, getLeaveRequests, getAllLeaveRequests } = require("../controllers/leaveController");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", submitLeaveRequest);
router.get("/", getLeaveRequests);
// Add route for provost to get all leave requests
router.get("/all", auth, isProvost, getAllLeaveRequests);

module.exports = router;
