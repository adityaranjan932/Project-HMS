const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addProvost() {
  try {
    console.log("Connecting to database...");

    // Check if provost already exists
    const existingProvost = await User.findOne({
      email: "provost@luhostel.in"
    });

    if (existingProvost) {
      console.log("Provost user already exists!");
      console.log("Existing provost:", {
        id: existingProvost._id,
        name: existingProvost.name,
        email: existingProvost.email,
        role: existingProvost.role
      });
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("provost123", saltRounds);

    // Create provost user
    const provostUser = new User({
      name: "Provost",
      email: "provost@luhostel.in",
      password: hashedPassword,
      role: "provost",
      mobile: "9999999999", // Default mobile
      gender: "other", // Default gender
      isVerifiedLU: true // Mark as verified
    });

    await provostUser.save();

    console.log("✅ Provost user created successfully!");
    console.log("Provost details:", {
      id: provostUser._id,
      name: provostUser.name,
      email: provostUser.email,
      role: provostUser.role,
      mobile: provostUser.mobile
    });

    console.log("\n🔑 Login credentials:");
    console.log("Email: provost@luhostel.in");
    console.log("Password: provost123");

  } catch (error) {
    console.error("❌ Error creating provost user:", error);
  } finally {
    mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
}

addProvost();
