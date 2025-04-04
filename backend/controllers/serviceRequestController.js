const ServiceRequest = require('../models/ServiceRequest');

const createServiceRequest = async (req, res) => {
  try {
    const { requestType, description } = req.body;
    const studentId = req.user._id; // Set from auth middleware

    // Create a new service request
    const newRequest = new ServiceRequest({
      studentId,
      requestType,
      description,
    });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
};

const getMyServiceRequests = async (req, res) => {
  try {
    const studentId = req.user._id; // Set from auth middleware
    const requests = await ServiceRequest.find({ studentId });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

module.exports = { createServiceRequest, getMyServiceRequests };