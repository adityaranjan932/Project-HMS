const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  year: Number,
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
