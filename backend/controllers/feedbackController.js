const Feedback = require("../models/feedbackModel");

const submitFeedback = async (req, res) => {
  try {
    const { feedbackType, customSubject, message } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    if (!feedbackType || !message) {
      return res.status(400).json({
        success: false,
        error: "Feedback type and message are required."
      });
    }

    const feedback = new Feedback({
      feedbackType,
      subject: feedbackType === "Other" ? customSubject : feedbackType,
      customSubject: feedbackType === "Other" ? customSubject : undefined,
      message,
      userId,
      status: 'pending'
    });

    await feedback.save();

    // Populate user info for response
    await feedback.populate('userId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while submitting feedback."
    });
  }
};

const getFeedback = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from auth middleware
    const feedbacks = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber roomNumber department courseName'
        }
      })
      .populate('resolvedBy', 'name');

    res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while retrieving feedback."
    });
  }
};

// Get all feedback for provost
const getAllFeedback = async (req, res) => {
  try {
    console.log("Fetching all feedback for provost..."); // Debug log
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: 'name email',
        populate: {
          path: 'studentProfile',
          select: 'rollNumber roomNumber department courseName'
        }
      })
      .populate('resolvedBy', 'name');

    console.log(`Found ${feedbacks.length} feedback entries`); // Debug log
    res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    console.error("Error fetching all feedback:", error); res.status(500).json({
      success: false,
      error: "An error occurred while retrieving feedback."
    });
  }
};

// Resolve feedback (for Provost)
const resolveFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status, response } = req.body;
    const resolvedBy = req.user.id;

    if (!feedbackId || !status) {
      return res.status(400).json({
        success: false,
        error: "Feedback ID and status are required."
      });
    }

    const validStatuses = ["pending", "in-progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be one of: pending, in-progress, resolved, closed"
      });
    }

    const updateData = {
      status,
      response: response || ""
    };

    // If marking as resolved or closed, add resolution details
    if (status === "resolved" || status === "closed") {
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedAt = new Date();
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      updateData,
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber roomNumber department courseName'
      }
    }).populate('resolvedBy', 'name email');

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found."
      });
    }

    res.status(200).json({
      success: true,
      data: updatedFeedback,
      message: `Feedback ${status} successfully.`
    });
  } catch (error) {
    console.error("Error resolving feedback:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while resolving the feedback."
    });
  }
};

module.exports = { submitFeedback, getFeedback, getAllFeedback, resolveFeedback };
