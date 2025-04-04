const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: String,
  semester: Number,
  result: {
    percentage: Number,
    backlog: Boolean
  },
  isEligible: Boolean,
  roomNumber: { type: String },
  admissionYear: Number
});

module.exports = mongoose.model("StudentProfile", StudentProfileSchema);
