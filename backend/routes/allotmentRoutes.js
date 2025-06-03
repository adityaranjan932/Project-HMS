const express = require('express');
const router = express.Router();
const allotmentController = require('../controllers/allotmentController');
const { auth, isProvost } = require('../middleware/auth'); // Changed to isProvost

// POST /api/v1/allotment/allot-rooms
// router.post('/allot-rooms', auth, isProvost, allotmentController.allotRooms); // Temporarily unprotected
router.post('/allot-rooms', allotmentController.allotRooms); // Temporarily unprotected

// GET /api/v1/allotment/availability
// router.get('/availability', auth, isProvost, allotmentController.getRoomAvailability); // Temporarily unprotected
router.get('/availability', allotmentController.getRoomAvailability); // Temporarily unprotected

// GET /api/v1/allotment/allotted-students - Route to get all allotted students (Provost only)
router.get('/allotted-students', auth, isProvost, allotmentController.getAllAllottedStudents);

module.exports = router;
