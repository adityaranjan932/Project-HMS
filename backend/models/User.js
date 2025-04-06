const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String }, // hashed password
  role: {
    type: String,
    enum: ['student', 'provost', 'chiefProvost'],
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  isVerifiedLU: { type: Boolean, default: false }, // University of Lucknow verified
});

module.exports = mongoose.model("User", UserSchema);
