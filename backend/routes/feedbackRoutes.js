const express = require("express");
const { submitFeedback, getFeedback } = require("../controllers/feedbackController");
const validateFeedback = require("../middleware/validateFeedback");

const router = express.Router();

router.post("/submit", validateFeedback, submitFeedback);
router.get("/", getFeedback);

module.exports = router;
