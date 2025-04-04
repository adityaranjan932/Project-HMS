const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requestType: { type: String, enum: ['maintenance', 'cleaning', 'others'] },
  description: String,
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
