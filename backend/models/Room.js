const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, unique: true },
  type: { type: String, enum: ['single', 'double'], required: true },
  hostelType: { type: String, enum: ['girls', 'boys'], required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isOccupied: { type: Boolean, default: false },
  maxOccupants: { type: Number, default: 1 }
});

module.exports = mongoose.model("Room", RoomSchema);
