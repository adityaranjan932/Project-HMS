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
  fatherName: {
    type: String,
    default: "",
  },
  motherName: {
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
  courseName: {
    type: String,
    default: "",
  },
  semester: {
    type: Number,
    default: 0,
  },
  rollNumber: {
    type: String,
    default: "",
  },
  sgpaOdd: {
    type: Number,
    default: 0,
  },
  sgpaEven: {
    type: Number,
    default: 0,
  },
  isEligible: {
    type: Boolean,
    default: false,
  },
  roomNumber: {
    type: String,
    default: null,
  },
  roomPreference: {
    type: String,
    enum: ["single", "double", "triple"],
    default: "double",
  },
  admissionYear: {
    type: Number,
    default: new Date().getFullYear(),
  },
  contactNumber: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("RegisteredStudentProfile", StudentProfileSchema);
