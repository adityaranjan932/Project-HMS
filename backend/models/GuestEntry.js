const mongoose = require("mongoose");

const GuestEntrySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  guestName: String,
  relation: String,
  inDate: Date,
  outDate: Date
});

module.exports = mongoose.model("GuestEntry", GuestEntrySchema);
