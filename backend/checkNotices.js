// Quick script to check notices in database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/hostel-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const PublicNotice = require('./models/PublicNotice');
const User = require('./models/User');

async function checkNotices() {
  try {
    console.log('\n=== CHECKING PUBLIC NOTICES IN DATABASE ===\n');

    // Get all notices
    const allNotices = await PublicNotice.find({}).populate('author', 'firstName lastName');
    console.log(`Total notices in database: ${allNotices.length}`);

    if (allNotices.length > 0) {
      console.log('\nAll notices:');
      allNotices.forEach((notice, index) => {
        console.log(`${index + 1}. Title: "${notice.title}"`);
        console.log(`   Status: ${notice.status}`);
        console.log(`   Published: ${notice.publishedAt ? 'Yes' : 'No'}`);
        console.log(`   Author: ${notice.author ? `${notice.author.firstName} ${notice.author.lastName}` : 'Unknown'}`);
        console.log(`   Created: ${notice.createdAt}`);
        console.log(`   ---`);
      });
    }

    // Get only published notices
    const publishedNotices = await PublicNotice.find({ status: 'published' }).populate('author', 'firstName lastName');
    console.log(`\nPublished notices: ${publishedNotices.length}`);
    if (publishedNotices.length > 0) {
      console.log('\nPublished notices:');
      publishedNotices.forEach((notice, index) => {
        console.log(`${index + 1}. Title: "${notice.title}"`);
        console.log(`   Category: ${notice.category}`);
        console.log(`   Published At: ${notice.publishedAt}`);
        console.log(`   Effective Date: ${notice.effectiveDate}`);
        console.log(`   Expiry Date: ${notice.expiryDate || 'No expiry'}`);
        console.log(`   Is Effective Now: ${notice.effectiveDate <= new Date()}`);
        console.log(`   PDF Path: ${notice.pdfPath || 'None'}`);
        console.log(`   ---`);
      });
    } else {
      console.log('No published notices found. This is why the Notice Board is empty!');
    }

  } catch (error) {
    console.error('Error checking notices:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

checkNotices();
