const express = require("express");
const { submitLeaveRequest, getLeaveRequests } = require("../controllers/leaveController");

const router = express.Router();

router.post("/submit", submitLeaveRequest);
router.get("/", getLeaveRequests);

module.exports = router;
