const User = require("../models/User");
const OTP = require("../models/OTP");
const registeredStudentProfile = require("../models/StudentProfile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  fetchCombinedResults,
} = require("../utils/fetchResult");
const RegisteredStudentProfile = require("../models/StudentProfile");

require("dotenv").config();

// Send OTP

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }

    // Calculate expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const otpPayload = { email, otp, expiresAt };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
      expiresAt: expiresAt
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
// ************************************************************************************************

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOTP || recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (recentOTP.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP.",
    });
  }
};

// ************************************************************************************************

// Check Hostel Eligibility
exports.checkHostelEligibility = async (req, res) => {
  try {
    const data = req.body;
    const combinedResults = await fetchCombinedResults(data);

    if (combinedResults.status === "error") {
      return res.status(400).json({ success: false, message: combinedResults.message });
    }

    return res.status(200).json({
      success: true,
      data: combinedResults,
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking eligibility.",
    });
  }
};

// ************************************************************************************************

// Email & OTP Verification (was signUp)
exports.emailVerification = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      otp
      // studentName, mobile, gender removed as user creation is moved
    } = req.body;

    // Log incoming data for debugging
    console.log("Email verification request received with data:", { email, otp });

    // Validate required fields
    if (!email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing: email, password, confirmPassword, and otp are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Validate OTP
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email. Please request a new OTP.",
      });
    }
    if (recentOTP.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }
    if (recentOTP.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // OTP is valid. Do not create user here.
    // User creation/update will happen in createOrUpdateRegisteredStudentProfile.

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Please complete your profile details.",
      // No token or user data returned here
    });

  } catch (error) {
    // Log error for debugging
    console.error("Email Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification. Please try again later.",
      error: error.message,
    });
  }
};

// ************************************************************************************************

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

// ************************************************************************************************

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
// ************************************************************************************************

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

// ************************************************************************************************

// Check if email already exists in database
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      // Email exists
      return res.status(409).json({
        exists: true,
        message: "This email is already registered",
        status: user.isVerifiedLU ? "active" : "pending",
      });
    }

    // Email does not exist
    return res.status(200).json({
      exists: false,
      message: "Email is available for registration",
    });

  } catch (error) {
    console.error("Error in checkEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking email availability",
      error: error.message,
    });
  }
};

// ************************************************************************************************

// Check verification status in database
exports.verificationStatus = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find the most recent OTP for this email
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOTP) {
      return res.status(200).json({
        verified: false,
        message: "No verification record found",
      });
    }

    // Check if it's expired
    const isExpired = recentOTP.expiresAt < Date.now();

    return res.status(200).json({
      verified: !isExpired,
      message: isExpired
        ? "Verification expired, please request a new OTP"
        : "Verification is valid",
      expiresAt: recentOTP.expiresAt,
    });

  } catch (error) {
    console.error("Error in verificationStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking verification status",
      error: error.message,
    });
  }
};
// ************************************************************************************************

// Create or update RegisteredStudentProfile for a registered user
exports.createOrUpdateRegisteredStudentProfile = async (req, res) => {
  try {
    const {
      email, // use email to find user
      password, // required for user creation
      studentName,
      fatherName,
      motherName,
      gender,
      department,
      courseName,
      semester,
      rollno,
      sgpaOdd,
      sgpaEven,
      roomPreference,
      admissionYear,
      contactNumber
    } = req.body;

    if (!email || !password || !studentName || !gender || !contactNumber || !department || !courseName || !semester || !rollno) {
      return res.status(400).json({ success: false, message: "Required fields are missing. Please provide all required details." });
    }

    let user = await User.findOne({ email });
    if (user && user.isVerifiedLU) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered and verified. Please login or contact support.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let responseMessage;

    if (user) {
      // User exists but not verified, update
      user.password = hashedPassword;
      user.name = studentName;
      user.gender = gender;
      user.mobile = contactNumber;
      user.isVerifiedLU = true;
      await user.save();
      responseMessage = "User details updated and profile saved successfully.";
    } else {
      // User does not exist, create new user
      user = await User.create({
        name: studentName,
        email,
        password: hashedPassword,
        role: "student",
        gender: gender,
        mobile: contactNumber,
        isVerifiedLU: true,
      });
      responseMessage = "User created and profile saved successfully.";
    }

    // Upsert RegisteredStudentProfile
    const profile = await RegisteredStudentProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        name: studentName,
        fatherName: fatherName || "",
        motherName: motherName || "",
        gender: gender,
        department: department,
        courseName: courseName,
        semester: parseInt(semester) || 0,
        rollNumber: rollno,
        sgpaOdd: parseFloat(sgpaOdd) || 0,
        sgpaEven: parseFloat(sgpaEven) || 0,
        roomPreference: roomPreference || "double",
        isEligible: true,
        admissionYear: admissionYear || new Date().getFullYear(),
        contactNumber: contactNumber
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: responseMessage,
      profile
    });
  } catch (error) {
    console.error("Create/Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error during profile creation/update: " + error.message });
  }
};

// ************************************************************************************************
//Fetch All Student Profiles
exports.getAllRegisteredStudentProfiles = async (req, res) => {
  try {
    const students = await registeredStudentProfile.find({});
    res.json({ success: true, data: students })
  }
  catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" })
  }
}