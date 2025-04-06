const MaintenanceRequest = require("../models/MaintenanceRequest");

const createMaintenanceRequest = async (req, res) => {
  try {
    const { requestType, description } = req.body;
    const userId = req.user._id;

    // Debugging: Log incoming data
    console.log("Request Body:", req.body);
    console.log("User ID:", userId);

    if (!requestType || !description) {
      return res.status(400).json({ error: "Request type and description are required." });
    }

    const newRequest = new MaintenanceRequest({ userId, requestType, description });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating maintenance request:", error.message); // Log the error
    res.status(500).json({ error: "Failed to create maintenance request." });
  }
};

const getUserMaintenanceRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await MaintenanceRequest.find({ userId });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch maintenance requests." });
  }
};

module.exports = { createMaintenanceRequest, getUserMaintenanceRequests };
