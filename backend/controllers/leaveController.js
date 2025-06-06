const LeaveRequest = require("../models/LeaveRequest");

const submitLeaveRequest = async (req, res) => {
  try {
    const { reason, startDate, endDate, emergencyContact, leaveType } = req.body;
    const studentId = req.user.id;

    if (!reason || !startDate || !endDate || !emergencyContact || !leaveType) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: reason, start date, end date, emergency contact, and leave type."
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date."
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Start date cannot be in the past."
      });
    }

    const leaveRequest = new LeaveRequest({
      studentId,
      reason,
      leaveType,
      fromDate: startDate,
      toDate: endDate,
      emergencyContact,
    }); await leaveRequest.save();

    // Populate user details before sending response
    await leaveRequest.populate({
      path: 'studentId',
      select: 'name email',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber roomNumber department courseName'
      }
    });

    res.status(201).json({
      success: true,
      data: leaveRequest,
      message: "Leave request submitted successfully."
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while submitting the leave request."
    });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveRequests = await LeaveRequest.find({ studentId: userId })
      .populate({
        path: 'studentId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber department courseName'
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leaveRequests,
      message: "Leave requests retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching user leave requests:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving leave requests."
    });
  }
};

// Get all leave requests for provost (with user details populated)
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate({
        path: 'studentId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber roomNumber department courseName'
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leaveRequests,
      message: "All leave requests retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching all leave requests:", error); res.status(500).json({
      success: false,
      error: "An error occurred while retrieving leave requests."
    });
  }
};

// Resolve a leave request (for Provost)
const resolveLeaveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, provostComments } = req.body;
    const resolvedBy = req.user.id;

    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        error: "Request ID and status are required."
      });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be one of: pending, approved, rejected"
      });
    }

    const updateData = {
      status,
      provostComments: provostComments || ""
    };

    // If approving or rejecting, mark as resolved
    if (status !== "pending") {
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedAt = new Date();
    }

    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    ).populate({
      path: 'studentId',
      select: 'name email',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber roomNumber department courseName'
      }
    }).populate('resolvedBy', 'name email');

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        error: "Leave request not found."
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: `Leave request ${status} successfully.`
    });
  } catch (error) {
    console.error("Error resolving leave request:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while resolving the leave request."
    });
  }
};

module.exports = { submitLeaveRequest, getLeaveRequests, getAllLeaveRequests, resolveLeaveRequest };
