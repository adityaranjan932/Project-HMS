const User = require("../models/User");
const OTP = require("../models/OTP");
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
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    let otp;
    let otpExists = true;
    let attempts = 0;
    const maxAttempts = 10; // To prevent potential infinite loops

    while (otpExists && attempts < maxAttempts) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const existingOtp = await OTP.findOne({ otp });
      if (!existingOtp) {
        otpExists = false;
      }
      attempts++;
    }

    if (otpExists) {
      console.error("Failed to generate a unique OTP after several attempts.");
      return res.status(500).json({
        success: false,
        message: "Could not generate a unique OTP. Please try again later.",
      });
    }

    console.log("Generated unique OTP:", otp);

    // Calculate expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const otpPayload = { email, otp, expiresAt };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    // **TODO**: Add actual OTP sending logic here (e.g., using an email service like Nodemailer)
    // For example: await mailSender(email, "Verification OTP", `Your OTP is: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully (simulation - check console/DB for OTP)`, // Modify message if actual sending is implemented
      otp, // Consider removing OTP from response in production if sent via email/SMS
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
    } = req.body;

    console.log("Email verification request received with data:", { email, otp });

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

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Please complete your profile details.",
    });

  } catch (error) {
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

    // Construct user name based on available fields (firstName, lastName or name)
    let userName = "Student"; // Default
    if (user.firstName && user.lastName) {
      userName = `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
      userName = user.name;
    }


    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: userName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
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
    console.error("Provost Login Error:", err);
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
    console.error("Chief Provost Login Error:", err);
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
      return res.status(200).json({ // Changed to 200 as it's a successful check
        exists: true,
        message: "This email is already registered",
        status: user.isVerifiedLU ? "active" : "pending", // isVerifiedLU from your User model
      });
    }

    return res.status(200).json({ // Changed to 200
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

    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOTP) {
      return res.status(200).json({ // Changed to 200
        verified: false,
        message: "No verification record found for this email.",
      });
    }

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
      email,
      password,
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

    // Check for existing roll number uniqueness
    if (rollno) { 
        const existingProfileWithRollNo = await RegisteredStudentProfile.findOne({ rollNumber: rollno });

        // If a profile with this roll number exists AND 
        // (either it's a new user registration attempt (user is null) OR 
        // it's an existing user but the roll number belongs to a different user's profile)
        // then it's a conflict.
        if (existingProfileWithRollNo && (!user || existingProfileWithRollNo.userId.toString() !== user._id.toString())) {
            return res.status(409).json({
                success: false,
                message: `Roll number '${rollno}' is already registered. Please use a different roll number.`,
            });
        }
        // If user exists and existingProfileWithRollNo.userId matches user._id,
        // it means the user is likely updating their own profile with their own roll number, which is fine.
    }

    // Logic to handle existing verified users trying to re-register profile
    if (user && user.isVerifiedLU) {
      const existingProfile = await RegisteredStudentProfile.findOne({ userId: user._id });
      if (existingProfile) {
        return res.status(409).json({
          success: false,
          message: "This email is already registered and has a complete profile. Please login or contact support.",
        });
      }
      // If user is verified but no profile exists (e.g., incomplete previous registration), allow profile creation/update.
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let responseMessage;

    // Prepare user data, assuming User model might have firstName, lastName
    const nameParts = studentName.split(' ');
    const firstName = nameParts[0] || studentName;
    const lastName = nameParts.slice(1).join(' ') || '';

    if (user) {
      // User exists (could be unverified, or verified but without a profile), update their details
      user.password = hashedPassword;
      // Update name fields based on your User model structure
      if (user.hasOwnProperty('firstName') && user.hasOwnProperty('lastName')) {
        user.firstName = firstName;
        user.lastName = lastName;
      } else if (user.hasOwnProperty('name')) {
        user.name = studentName; // If User model has a single 'name' field
      }
      user.gender = gender;
      user.mobile = contactNumber;
      user.isVerifiedLU = true; // Mark/re-mark as verified
      await user.save();
      responseMessage = "User details updated and profile saved successfully.";
    } else {
      // User does not exist, create new user
      let newUserFields = {
        email,
        password: hashedPassword,
        role: "student",
        gender: gender,
        mobile: contactNumber,
        isVerifiedLU: true, // New user is created as verified through this flow
      };
      // Add name fields based on your User model structure
      // A more robust way to check if fields exist in the schema:
      if (User.schema.paths.hasOwnProperty('firstName') && User.schema.paths.hasOwnProperty('lastName')) {
        newUserFields.firstName = firstName;
        newUserFields.lastName = lastName;
      } else if (User.schema.paths.hasOwnProperty('name')) {
        newUserFields.name = studentName; // If User model has a single 'name' field
      }
      user = await User.create(newUserFields);
      responseMessage = "User created and profile saved successfully.";
    }

    // Upsert RegisteredStudentProfile
    const profile = await RegisteredStudentProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        name: studentName, // Full name for the student profile
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
        isEligible: true, // Consider if eligibility should be determined by another logic or passed in request
        admissionYear: admissionYear || new Date().getFullYear(),
        contactNumber: contactNumber
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Prepare user data for response, ensuring name is correctly formatted
    let responseUserName = studentName; // Default to full studentName
    if (user.firstName && user.lastName) {
        responseUserName = `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
        responseUserName = user.name;
    }

    return res.status(200).json({
      success: true,
      message: responseMessage,
      profile,
      user: { // Optionally return some user info
        id: user._id,
        email: user.email,
        name: responseUserName,
        role: user.role
      }
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
    const students = await RegisteredStudentProfile.find({}); // Use PascalCase here
    res.status(200).json({ success: true, data: students });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching student profiles", error: err.message });
  }
};