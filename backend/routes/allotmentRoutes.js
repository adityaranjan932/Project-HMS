const express = require('express');
const router = express.Router();
const allotmentController = require('../controllers/allotmentController');
const { auth, isProvost } = require('../middleware/auth'); // Changed to isProvost

// POST /api/v1/allotment/allot-rooms
router.post('/allot-rooms', auth, isProvost, allotmentController.allotRooms); // Changed to isProvost

// GET /api/v1/allotment/availability
router.get('/availability', auth, isProvost, allotmentController.getRoomAvailability);

// GET /api/v1/allotment/allotted-students - New route to get all allotted students
router.get('/allotted-students', auth, isProvost, allotmentController.getAllAllottedStudents);

module.exports = router;
