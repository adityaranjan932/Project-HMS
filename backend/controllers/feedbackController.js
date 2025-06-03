const Feedback = require("../models/feedbackModel");

const submitFeedback = async (req, res) => {
  try {
    const { feedbackType, customSubject, message } = req.body;

    if (!feedbackType || !message) {
      return res.status(400).json({ error: "Feedback type and message are required." });
    }

    const feedback = new Feedback({
      feedbackType,
      subject: feedbackType === "Other" ? customSubject : feedbackType,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while submitting feedback." });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving feedback." });
  }
};

// Get all feedback for provost
const getAllFeedback = async (req, res) => {
  try {
    console.log("Fetching all feedback for provost..."); // Debug log
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    console.log(`Found ${feedbacks.length} feedback entries`); // Debug log
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    res.status(500).json({ error: "An error occurred while retrieving feedback." });
  }
};

module.exports = { submitFeedback, getFeedback, getAllFeedback };
