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

// Define a function to send the email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification mail from HMS",
      `Your OTP is: ${otp}`
    );
    console.log("Email sent successfully", mailResponse);
  } catch (error) {
    console.error("Error occurred while sending email:", error.message); // Log error message
    throw error; // Ensure the error is propagated
  }
}

// Define a pre-save hook to send email before the document is saved
OTPSchema.pre("save", async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
  } catch (error) {
    console.error("Error sending verification email:", error.message); // Log error message
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);