const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  fromDate: Date,
  toDate: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);
