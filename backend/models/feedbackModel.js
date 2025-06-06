const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackType: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customSubject: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'closed'], default: 'pending' },
    response: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
