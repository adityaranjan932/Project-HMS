const MaintenanceRequest = require("../models/MaintenanceRequest");

// Submit a maintenance request
exports.submitMaintenanceRequest = async (req, res) => {
  try {
    const { requestType, description } = req.body;
    const userId = req.user.id; // Assuming user ID is attached to the request by auth middleware

    if (!requestType || !description) {
      return res.status(400).json({ error: "Request type and description are required." });
    }

    const maintenanceRequest = new MaintenanceRequest({
      userId,
      requestType,
      description,
    });

    await maintenanceRequest.save();
    res.status(201).json(maintenanceRequest);
  } catch (error) {
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
