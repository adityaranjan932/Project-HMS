const mongoose = require('mongoose');
const AllottedStudent = require('../models/AllottedStudent');
require('dotenv').config();

const updateHostelNames = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Update all AllottedStudent records that don't have hostelName set
    const result = await AllottedStudent.updateMany(
      {
        $or: [
          { hostelName: { $exists: false } },
          { hostelName: null },
          { hostelName: "" }
        ]
      },
      {
        $set: {
          hostelName: "Kautilya Hall"
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} AllottedStudent records with hostelName`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  updateHostelNames();
}

module.exports = updateHostelNames;
