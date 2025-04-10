const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchResult = require("../utils/fetchResult");
const StudentProfile = require("../models/StudentProfile");

require("dotenv").config();

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is already registered`,
      });
    }

    // Optional: Delete old OTPs for same email
    await OTP.deleteMany({ email });

    let otp;
    let existingOTP;

    // Generate unique OTP
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOTP = await OTP.findOne({ otp });
    } while (existingOTP);

    const otpPayload = {
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // expires in 10 minutes
    };

    await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully`,
      otp, // remove in production
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};


// Check Hostel Eligibility
exports.checkHostelEligibility = async (req, res) => {
  try {
    const { CourseId, Semester, ExamType, SubjectId, Rollno, Dob1 } = req.body;

    // Validate required fields
    if (!CourseId || !Semester || !ExamType || !SubjectId || !Rollno || !Dob1) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const resultData = await fetchResult({
      CourseId,
      Semester,
      ExamType,
      SubjectId,
      Rollno,
      Dob1,
    });

    if (resultData.status === "error") {
      return res.status(400).json({
        success: false,
        message: resultData.message,
        data: resultData.data || null
      });
    }

    // If we reach here, the student is eligible
    return res.status(200).json({
      success: true,
      message: resultData.message,
      data: resultData.data
    });

  } catch (error) {
    console.error("Eligibility check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during eligibility check",
      error: error.message
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { email, password, confirmPassword, otp, name, gender } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !otp || !name || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields (email, password, confirmPassword, otp, name, gender) are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Validate OTP
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOTP || recentOTP.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      gender,
      isVerifiedLU: true,
    });

    // Create profile
    const profile = await StudentProfile.create({
      userId: user._id,
      name,
      gender,
      department: "",
      semester: 0,
      isEligible: false,
      admissionYear: new Date().getFullYear(),
    });


    return res.status(200).json({
      success: true,
      message: "Signup successful",
      user,
      profile,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};


// Student Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a student account",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed due to server error",
      error: error.message,
    });
  }
};

// Provost Login
exports.provostLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.PROVOST_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid provost email.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, process.env.PROVOST_PASSWORD_HASH);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid provost password.",
      });
    }

    const token = jwt.sign(
      { email, role: "provost" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Provost logged in successfully.",
      token,
      role: "provost",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Chief Provost Login
exports.chiefProvostLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.CHIEF_PROVOST_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid chief provost email.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, process.env.CHIEF_PROVOST_PASSWORD_HASH);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid chief provost password.",
      });
    }

    const token = jwt.sign(
      { email, role: "chief-provost" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Chief Provost logged in successfully.",
      token,
      role: "chief-provost",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
