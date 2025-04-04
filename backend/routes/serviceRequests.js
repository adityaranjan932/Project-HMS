const express = require('express');
const router = express.Router();
const { createServiceRequest, getMyServiceRequests } = require('../controllers/serviceRequestController');
const auth = require('../middleware/auth');

// Middleware for validating service request payload
const validateServiceRequest = (req, res, next) => {
  const { requestType, description } = req.body;
  if (!requestType || !description) {
    return res.status(400).json({ message: 'Request type and description are required' });
  }
  next();
};

// Routes
router.post('/service-requests', auth, validateServiceRequest, createServiceRequest);
router.get('/service-requests/my', auth, getMyServiceRequests);

module.exports = router;