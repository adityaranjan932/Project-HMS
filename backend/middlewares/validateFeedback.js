const validateFeedback = (req, res, next) => {
  const { feedbackType, message } = req.body;

  if (!feedbackType || !message) {
    return res.status(400).json({ error: "Feedback type and message are required." });
  }

  next();
};

module.exports = validateFeedback;
