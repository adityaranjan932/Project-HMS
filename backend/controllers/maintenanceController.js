const MaintenanceRequest = require("../models/MaintenanceRequest");

// Submit a maintenance request
exports.submitMaintenanceRequest = async (req, res) => {
  try {
    const { requestType, description, photoDataUrl } = req.body; // Added photoDataUrl
    const userId = req.user.id; // Assuming user ID is attached to the request by auth middleware

    if (!requestType || !description) {
      return res.status(400).json({ error: "Request type and description are required." });
    }

    const maintenanceRequest = new MaintenanceRequest({
      userId,
      requestType,
      description,
      photo: photoDataUrl, // Save photo
    });

    await maintenanceRequest.save();
    res.status(201).json(maintenanceRequest);
  } catch (error) {
    console.error("Error submitting maintenance request:", error); // Log the error
    res.status(500).json({ error: "An error occurred while submitting the maintenance request." });
  }
};

// Get maintenance requests for the logged-in user
exports.getUserMaintenanceRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is attached to the request by auth middleware
    const requests = await MaintenanceRequest.find({ userId });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving maintenance requests." });
  }
};

// Get all maintenance requests (for Provost)
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find().populate('userId', 'name email rollNumber roomNumber firstName'); // Populate user details
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching all maintenance requests:", error); // Log the error
    res.status(500).json({ error: "An error occurred while retrieving all maintenance requests." });
  }
};
