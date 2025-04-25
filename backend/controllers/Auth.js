const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  fetchOddResult,
  fetchEvenResult,
  fetchCombinedResults,
  checkHostelEligibility,
} = require("../utils/fetchResult");
const StudentProfile = require("../models/StudentProfile");

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

exports.signUp = async (req, res) => {
  try {
    const { 
      email,
      password,
      confirmPassword,
      otp,
      studentName,
      mobile,
      gender
    } = req.body;

    console.log("Signup request received with data:", { email, studentName, gender, mobile, otp });
    
    // Validate required fields
    if (!email || !password || !otp || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing: email, password, otp, and mobile are required",
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
        message: "User already exists with this email. Please log in or use a different email.",
      });
    }

    // Validate OTP before proceeding
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

    // Check if the OTP is expired
    if (recentOTP.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check if the OTP is expired
    if (recentOTP.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user only (not student profile)
    const user = await User.create({
      name: studentName || "User",
      email,
      password: hashedPassword,
      role: "student",
      gender: gender || "other",
      mobile,
      isVerifiedLU: true,
    });

    // Generate JWT token for authentication
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
      message: "Registration successful! Welcome to the hostel management system.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender
      },
      token
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed due to a server error. Please try again later.",
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

// Create or update StudentProfile for a registered user
exports.createOrUpdateStudentProfile = async (req, res) => {
  try {
    const {
      email, // use email to find user
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

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Upsert StudentProfile
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        name: studentName || user.name,
        fatherName: fatherName || "",
        motherName: motherName || "",
        gender: gender || user.gender,
        department: department || courseName || "",
        courseName: courseName || "",
        semester: parseInt(semester) || 0,
        rollNumber: rollno || "",
        sgpaOdd: parseFloat(sgpaOdd) || 0,
        sgpaEven: parseFloat(sgpaEven) || 0,
        roomPreference: roomPreference || "double",
        isEligible: true,
        admissionYear: admissionYear || new Date().getFullYear(),
        contactNumber: contactNumber || user.mobile
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Student profile saved successfully.",
      profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
