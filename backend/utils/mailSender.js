const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  try {
    // Debug: Check if env variables are loaded
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS is set:", !!process.env.EMAIL_PASS);

    // Recommended Gmail transporter config
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info.response); // Log success response
    return info;
  } catch (error) {
    console.error("Error in mailSender:", error); // Log full error
    throw error;
  }
};

module.exports = mailSender;
