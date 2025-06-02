const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  fetchCombinedResults,
} = require("../utils/fetchResult");
const RegisteredStudentProfile = require("../models/RegisteredStudentProfile");
const AllottedStudent = require("../models/AllottedStudent"); // Added AllottedStudent model

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

    // Check if the student has been allotted a room
    const allotmentRecord = await AllottedStudent.findOne({ userId: user._id });
    if (!allotmentRecord) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You have not been allotted a room yet. Please complete the allotment process.",
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
      studentName, // This should be `name` to match User model if it's the primary name field
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

    // Basic validation
    if (!email || !password || !studentName || !gender || !contactNumber || !department || !courseName || !semester || !rollno) {
      return res.status(400).json({ success: false, message: "Required fields are missing. Please provide all required details." });
    }

    let user = await User.findOne({ email });

    // Check for existing roll number uniqueness
    if (rollno) { 
        const existingProfileWithRollNo = await RegisteredStudentProfile.findOne({ rollNumber: rollno });
        if (existingProfileWithRollNo && (!user || existingProfileWithRollNo.userId.toString() !== user._id.toString())) {
            return res.status(409).json({
                success: false,
                message: `Roll number '${rollno}' is already registered. Please use a different roll number.`,
            });
        }
    }

    // Hashing the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Password Hashing Error:", hashError);
      return res.status(500).json({
        success: false,
        message: "Error processing password. Please try again.",
      });
    }

    // If user does not exist, create a new user
    if (!user) {
      user = new User({
        name: studentName, // Assuming studentName is the main name for the User model
        email,
        password: hashedPassword,
        role: 'student', // Default role for new registrations via this route
        gender, // Assuming gender is also part of the User model
        mobile: contactNumber, // Assuming contactNumber maps to mobile in User model
        isVerifiedLU: true, // Mark as verified since they are completing profile
      });
    } else {
      // If user exists but is not verified or password needs update (e.g. forgot password flow later)
      // For now, we assume if user exists, they are proceeding after email/OTP verification
      // and we might want to update their password if they are setting it for the first time here.
      if (!user.isVerifiedLU) { // If they were in a pending state
        user.password = hashedPassword; // Set/update password
        user.isVerifiedLU = true; // Mark as verified
      }
      // Update other user fields if necessary, e.g., name, gender, mobile
      user.name = studentName;
      user.gender = gender;
      user.mobile = contactNumber;
    }
    // Save the user (either new or updated)
    await user.save();

    // Now, create or update the student profile
    let studentProfile = await RegisteredStudentProfile.findOne({ userId: user._id });

    if (!studentProfile) {
      studentProfile = new RegisteredStudentProfile({
        userId: user._id,
        email: user.email, // Store email in profile for convenience
        name: studentName,
        fatherName,
        motherName,
        gender,
        department,
        courseName,
        semester,
        rollNumber: rollno, // Ensure field name matches schema (rollNumber vs rollno)
        sgpaOdd,
        sgpaEven,
        roomPreference,
        admissionYear,
        contactNumber,
        isEligible: true, // Explicitly set isEligible to true for new profiles
        // hostelFeePaid: false, // Default values if needed
        // messFeePaid: false,
      });
    } else {
      // Update existing profile
      studentProfile.name = studentName;
      studentProfile.fatherName = fatherName;
      studentProfile.motherName = motherName;
      studentProfile.gender = gender;
      studentProfile.department = department;
      studentProfile.courseName = courseName;
      studentProfile.semester = semester;
      studentProfile.rollNumber = rollno;
      studentProfile.sgpaOdd = sgpaOdd;
      studentProfile.sgpaEven = sgpaEven;
      studentProfile.roomPreference = roomPreference;
      studentProfile.admissionYear = admissionYear;
      studentProfile.contactNumber = contactNumber;
      studentProfile.isEligible = true; // Ensure isEligible is true on update as well
    }

    await studentProfile.save();

    // CRITICAL STEP: Link the studentProfile to the User model
    user.studentProfile = studentProfile._id;
    await user.save();

    // Create token for immediate login after registration (optional)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Student profile registered/updated successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfileId: studentProfile._id // Send profile ID back
      },
    });

  } catch (error) {
    console.error("Error in createOrUpdateRegisteredStudentProfile:", error);
    // Check for duplicate key errors (e.g., if rollNumber is unique and there's a conflict)
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: `Registration failed. A student with similar unique details (e.g., roll number) might already exist.`,
            error: error.message
        });
    }
    return res.status(500).json({
      success: false,
      message: "Server error during profile registration/update.",
      error: error.message,
    });
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