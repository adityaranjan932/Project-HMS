const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  noticeType: {
    type: String,
    enum: ['Behavioral Warning', 'Academic Warning', 'Disciplinary Action', 'General Notice'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  actionRequired: {
    type: String,
    trim: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['sent', 'acknowledged', 'resolved'],
    default: 'sent'
  }
}, {
  timestamps: true
});

// Index for efficient queries
NoticeSchema.index({ recipientId: 1, createdAt: -1 });
NoticeSchema.index({ senderId: 1, createdAt: -1 });

module.exports = mongoose.model("Notice", NoticeSchema);
