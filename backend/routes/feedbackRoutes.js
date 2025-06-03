const express = require("express");
const { submitFeedback, getFeedback, getAllFeedback } = require("../controllers/feedbackController");
const validateFeedback = require("../middleware/validateFeedback");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", validateFeedback, submitFeedback);
router.get("/", getFeedback);
// Add route for provost to get all feedback
router.get("/all", auth, isProvost, getAllFeedback);

module.exports = router;
