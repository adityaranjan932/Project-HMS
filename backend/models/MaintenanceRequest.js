const mongoose = require("mongoose");

const MaintenanceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestType: { type: String, enum: ["maintenance", "cleaning", "others"], required: true },
  description: { type: String, required: true },
  photo: { type: String }, // Added photo field for base64 image data
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
