const express = require("express");
const { submitLeaveRequest, getLeaveRequests } = require("../controllers/leaveController");
const auth = require("../middleware/auth"); // Import authentication middleware

const router = express.Router();

router.post("/submit", auth, submitLeaveRequest);
router.get("/", auth, getLeaveRequests);
module.exports = router;
