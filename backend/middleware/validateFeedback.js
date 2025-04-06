const validateFeedback = (req, res, next) => {
  const { feedbackType, customSubject, message } = req.body;

  if (!feedbackType || !message) {
    return res.status(400).json({ error: "Feedback type and message are required." });
  }

  if (feedbackType === "Other" && !customSubject) {
    return res.status(400).json({ error: "Custom subject is required for 'Other' feedback type." });
  }

  next();
};

module.exports = validateFeedback;
