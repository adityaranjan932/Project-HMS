const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ Enables createdAt & updatedAt
  }
);

// TTL (15 mins = 900 seconds) based on createdAt
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

// Send verification email before saving
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification mail from Lucknow University",
      otp
    );
    console.log("email sent successfully", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email:", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
