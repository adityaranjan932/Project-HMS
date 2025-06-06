const express = require("express");
const { submitLeaveRequest, getLeaveRequests, getAllLeaveRequests, resolveLeaveRequest } = require("../controllers/leaveController");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", auth, submitLeaveRequest);
router.get("/", auth, getLeaveRequests);
// Add route for provost to get all leave requests
router.get("/all", auth, isProvost, getAllLeaveRequests);
// Resolve a leave request (for provost)
router.put("/resolve/:requestId", auth, isProvost, resolveLeaveRequest);

module.exports = router;
