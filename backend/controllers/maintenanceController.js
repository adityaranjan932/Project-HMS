const MaintenanceRequest = require("../models/MaintenanceRequest");

// Submit a maintenance request
exports.submitMaintenanceRequest = async (req, res) => {
  try {
    const { requestType, description, priority, photo } = req.body;
    const userId = req.user.id;

    if (!requestType || !description) {
      return res.status(400).json({
        success: false,
        error: "Request type and description are required."
      });
    }

    const maintenanceRequest = new MaintenanceRequest({
      userId,
      requestType,
      description,
      priority: priority || "medium",
      photo: photo || null,
    }); await maintenanceRequest.save();

    // Populate user details before sending response
    await maintenanceRequest.populate({
      path: 'userId',
      select: 'name email',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber roomNumber department courseName'
      }
    });

    res.status(201).json({
      success: true,
      data: maintenanceRequest,
      message: "Maintenance request submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting maintenance request:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while submitting the maintenance request."
    });
  }
};

// Get maintenance requests for the logged-in user
exports.getUserMaintenanceRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await MaintenanceRequest.find({ userId })
      .populate({
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber department courseName'
        }
      });
    res.status(200).json({
      success: true,
      data: requests,
      message: "Maintenance requests retrieved successfully"
    });
  } catch (error) {
    console.error("Error retrieving user maintenance requests:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving maintenance requests."
    });
  }
};

// Get all maintenance requests (for Provost)
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate({
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber department courseName'
        }
      });
    res.status(200).json({
      success: true,
      data: requests,
      message: "All maintenance requests retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching all maintenance requests:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving all maintenance requests."
    });
  }
};

// Resolve a maintenance request (for Provost)
exports.resolveMaintenanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, resolution, completionPhoto } = req.body;
    const resolvedBy = req.user.id;

    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        error: "Request ID and status are required."
      });
    }

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be one of: pending, in-progress, completed"
      });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // If marking as completed, add resolution details
    if (status === "completed") {
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedAt = new Date();
      if (resolution) {
        updateData.resolution = resolution;
      }
      if (completionPhoto) {
        updateData.completionPhoto = completionPhoto;
      }
    }

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber roomNumber department courseName'
      }
    }).populate('resolvedBy', 'name email');

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        error: "Maintenance request not found."
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: `Maintenance request ${status === 'completed' ? 'resolved' : 'updated'} successfully.`
    });
  } catch (error) {
    console.error("Error resolving maintenance request:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while resolving the maintenance request."
    });
  }
};
