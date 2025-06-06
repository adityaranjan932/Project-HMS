const express = require("express");
const { submitFeedback, getFeedback, getAllFeedback, resolveFeedback } = require("../controllers/feedbackController");
const validateFeedback = require("../middleware/validateFeedback");
const { auth, isProvost } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", auth, validateFeedback, submitFeedback);
router.get("/", auth, getFeedback);
// Add route for provost to get all feedback
router.get("/all", auth, isProvost, getAllFeedback);
// Resolve feedback (for provost)
router.put("/resolve/:feedbackId", auth, isProvost, resolveFeedback);

module.exports = router;
