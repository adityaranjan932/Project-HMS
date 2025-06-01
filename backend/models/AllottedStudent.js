const mongoose = require('mongoose');

const allottedStudentSchema = new mongoose.Schema({
    studentProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisteredStudentProfile',
        required: true,
        unique: true, // Ensures one allotment record per student profile
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollNumber: { // Roll number from the student's profile
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    sgpaOdd: {
        type: Number,
        required: true,
    },
    sgpaEven: {
        type: Number,
        required: true,
    },
    averageSgpa: {
        type: Number,
        required: true,
    },
    roomPreference: {
        type: String,
        enum: ['single', 'triple'], // Assuming student profile also uses these exact enums
        required: true,
    },
    allottedHostelType: { // Added to record which hostel type was allotted
        type: String,
        enum: ['boys', 'girls'],
        required: true,
    },
    allottedRoomType: { // Added to record which room type was actually allotted
        type: String,
        enum: ['single', 'triple'],
        required: true,
    },
    allottedRoomNumber: {
        type: String,
        required: true,
    },
    allottedBedId: {
        type: String,
        required: true,
    },
    floor: { // Added floor information
        type: String, // A, B, C
        required: true,
    },
    allotmentDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Important: If you previously had a unique index on rollNumber in MongoDB,
// you'll need to manually drop it from the collection using the mongo shell or an admin tool.
// e.g., db.allottedstudents.dropIndex("rollNumber_1");
// And then ensure an index is created for studentProfileId if it doesn't exist automatically:
// e.g., db.allottedstudents.createIndex({ studentProfileId: 1 }, { unique: true });

module.exports = mongoose.model('AllottedStudent', allottedStudentSchema);
