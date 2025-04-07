const LeaveRequest = require("../models/LeaveRequest");

const submitLeaveRequest = async (req, res) => {
  try {
    const { studentId, reason, startDate, endDate } = req.body;

    if (!studentId || !reason || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const leaveRequest = new LeaveRequest({
      studentId,
      reason,
      fromDate: startDate,
      toDate: endDate,
    });

    await leaveRequest.save();
    res.status(201).json({ message: "Leave request submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while submitting the leave request." });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate("studentId", "name email");
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving leave requests." });
  }
};

module.exports = { submitLeaveRequest, getLeaveRequests };
