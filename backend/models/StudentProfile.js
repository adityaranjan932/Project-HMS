const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
  },
  department: {
    type: String,
    default: "",
  },
  semester: {
    type: Number,
    default: 0,
  },
  result: {
    percentage: {
      type: Number,
      default: 0,
    },
    backlog: {
      type: Boolean,
      default: true,
    },
  },
  isEligible: {
    type: Boolean,
    default: false,
  },
  roomNumber: {
    type: String,
    default: null,
  },
  admissionYear: {
    type: Number,
    default: new Date().getFullYear(),
  },
});

module.exports = mongoose.model("StudentProfile", StudentProfileSchema);
