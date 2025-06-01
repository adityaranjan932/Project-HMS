const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, unique: true, required: true },
  type: { type: String, enum: ['single', 'triple'], required: true },
  hostelType: { type: String, enum: ['girls', 'boys'], required: true },
  floor: { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isOccupied: { type: Boolean, default: false },
  maxOccupants: { type: Number, required: true }
});

module.exports = mongoose.model("Room", RoomSchema);
