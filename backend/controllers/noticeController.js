const Notice = require("../models/Notice");
const User = require("../models/User");
const mongoose = require("mongoose");

// Send a notice to a student
exports.sendNotice = async (req, res) => {
  try {
    const { recipientId, noticeType, subject, message, actionRequired, isUrgent } = req.body;
    const senderId = req.user.id; // Provost ID from auth middleware

    // Validate required fields
    if (!recipientId || !noticeType || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, notice type, subject, and message are required."
      });
    }

    // Check if recipient exists and is a student
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found."
      });
    }

    if (recipient.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: "Notices can only be sent to students."
      });
    }

    // Create the notice
    const notice = new Notice({
      senderId,
      recipientId,
      noticeType,
      subject,
      message,
      actionRequired: actionRequired || '',
      isUrgent: isUrgent || false
    });

    await notice.save();

    // Populate sender details for response
    await notice.populate('senderId', 'name email role');
    await notice.populate('recipientId', 'name email');

    res.status(201).json({
      success: true,
      message: "Notice sent successfully",
      data: notice
    });

  } catch (error) {
    console.error("Error sending notice:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the notice.",
      error: error.message
    });
  }
};

// Get all notices sent by a provost
exports.getSentNotices = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const notices = await Notice.find({ senderId })
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments({ senderId });

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotices: total
      }
    });

  } catch (error) {
    console.error("Error fetching sent notices:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notices.",
      error: error.message
    });
  }
};

// Get all notices received by a student
exports.getReceivedNotices = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const notices = await Notice.find({ recipientId })
      .populate('senderId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments({ recipientId });

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotices: total
      }
    });

  } catch (error) {
    console.error("Error fetching received notices:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notices.",
      error: error.message
    });
  }
};

// Mark a notice as read
exports.markNoticeAsRead = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const userId = req.user.id;

    const notice = await Notice.findOne({ _id: noticeId, recipientId: userId });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found or you don't have permission to access it."
      });
    }

    if (!notice.isRead) {
      notice.isRead = true;
      notice.readAt = new Date();
      await notice.save();
    }

    res.status(200).json({
      success: true,
      message: "Notice marked as read",
      data: notice
    });

  } catch (error) {
    console.error("Error marking notice as read:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while marking notice as read.",
      error: error.message
    });
  }
};

// Get notice statistics for provost dashboard
exports.getNoticeStats = async (req, res) => {
  try {
    const senderId = req.user.id; const stats = await Notice.aggregate([
      { $match: { senderId: new mongoose.Types.ObjectId(senderId) } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: 1 },
          totalRead: { $sum: { $cond: [{ $eq: ["$isRead", true] }, 1, 0] } },
          totalUrgent: { $sum: { $cond: [{ $eq: ["$isUrgent", true] }, 1, 0] } },
          byType: {
            $push: {
              type: "$noticeType",
              count: 1
            }
          }
        }
      }
    ]); const typeStats = await Notice.aggregate([
      { $match: { senderId: new mongoose.Types.ObjectId(senderId) } },
      {
        $group: {
          _id: "$noticeType",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || { totalSent: 0, totalRead: 0, totalUrgent: 0 },
        byType: typeStats
      }
    });

  } catch (error) {
    console.error("Error fetching notice stats:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notice statistics.",
      error: error.message
    });
  }
};

// Get all notices (for admin/provost to see all notices in system)
exports.getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, noticeType } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (noticeType) filter.noticeType = noticeType;

    const notices = await Notice.find(filter)
      .populate('senderId', 'name email role')
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotices: total
      }
    });

  } catch (error) {
    console.error("Error fetching all notices:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notices.",
      error: error.message
    });
  }
};
