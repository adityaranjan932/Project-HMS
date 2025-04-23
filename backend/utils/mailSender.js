const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // Use MAIL_HOST from .env
      service: "Gmail", // Optional, can be removed if host is specified
      auth: {
        user: process.env.EMAIL_USER, // Ensure this is set in your .env file
        pass: process.env.EMAIL_PASS, // Ensure this is set in your .env file
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
    console.error("Error in mailSender:", error.message); // Log error message
    throw error;
  }
};

module.exports = mailSender;
