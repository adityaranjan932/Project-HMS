const RegisteredStudentProfile = require('../models/StudentProfile');
const AllottedStudent = require('../models/AllottedStudent');
const baseHostelRoomsData = require('../data/kautilyaHallData.js'); // Load the base static data

// Helper function to calculate average SGPA
const calculateAverageSgpa = (sgpaOdd, sgpaEven) => {
    const odd = (typeof sgpaOdd === 'number' && sgpaOdd >= 0) ? sgpaOdd : 0;
    const even = (typeof sgpaEven === 'number' && sgpaEven >= 0) ? sgpaEven : 0;
    if (odd === 0 && even === 0) return 0;
    return (odd + even) / 2;
};

exports.allotRooms = async (req, res) => {
    // Create a deep copy of hostelRoomsData to modify during this allotment cycle
    // This ensures the base data in hostelRoomData.js remains unchanged for subsequent calls
    // and that each allotment run starts with fresh room data.
    let currentHostelRoomsState = JSON.parse(JSON.stringify(baseHostelRoomsData));

    // Initialize currentOccupancy for each room in the copy if not already present in hostelRoomData.js
    currentHostelRoomsState.forEach(room => {
        if (room.currentOccupancy === undefined) {
            room.currentOccupancy = 0;
            room.beds.forEach(bed => {
                if (bed.studentId) { // If re-running and beds might have studentId from a previous version of data
                    room.currentOccupancy++;
                }
            });
        }
    });

    try {
        const existingAllotments = await AllottedStudent.find({}).select('studentProfileId -_id');
        const allottedProfileIds = existingAllotments.map(a => a.studentProfileId.toString());

        // Fetch all eligible students, then filter for boys and sort
        const allEligibleStudents = await RegisteredStudentProfile.find({
            isEligible: true,
            _id: { $nin: allottedProfileIds }
        }).populate('userId', 'gender'); // Populate gender for filtering

        if (!allEligibleStudents || allEligibleStudents.length === 0) {
            const availability = getRoomAvailabilityFromStaticData(currentHostelRoomsState);
            return res.status(200).json({
                success: true,
                message: 'No new eligible students found for allotment at this time.',
                allottedCount: 0,
                allottedStudents: [],
                availability
            });
        }

        // Filter for male students and calculate SGPA
        let studentsToProcess = allEligibleStudents
            .filter(student => student.userId && student.userId.gender && student.userId.gender.toLowerCase() === 'male')
            .map(student => ({
                ...student.toObject(),
                averageSgpa: calculateAverageSgpa(student.sgpaOdd, student.sgpaEven),
            }));

        // Sort all male students by average SGPA (descending)
        studentsToProcess.sort((a, b) => b.averageSgpa - a.averageSgpa);

        // Total available beds (150 for boys' hostel as per hostelRoomData.js)
        const totalBedsInHostel = currentHostelRoomsState.reduce((acc, room) => acc + room.capacity, 0);
        
        // Take only top students if registrations exceed available beds
        if (studentsToProcess.length > totalBedsInHostel) {
            console.log(`More than ${totalBedsInHostel} eligible male students (${studentsToProcess.length}). Allotting to top ${totalBedsInHostel} by SGPA.`);
            studentsToProcess = studentsToProcess.slice(0, totalBedsInHostel);
        }

        const allottedStudentsList = [];
        const dbUpdatePromises = [];

        // Separate students by preference for single rooms
        const singlePreferenceStudents = studentsToProcess
            .filter(s => s.roomPreference === 'single')
            .sort((a, b) => b.averageSgpa - a.averageSgpa); // Ensure sorted by SGPA

        const otherStudents = studentsToProcess
            .filter(s => s.roomPreference !== 'single')
            .sort((a, b) => b.averageSgpa - a.averageSgpa); // Ensure sorted by SGPA

        // Allot single rooms first to those who preferred them, based on SGPA
        let singleRoomsAllottedCount = 0;
        const totalSingleBeds = currentHostelRoomsState
            .filter(r => r.type === 'single')
            .reduce((acc, room) => acc + room.capacity, 0);

        for (const student of singlePreferenceStudents) {
            if (singleRoomsAllottedCount >= totalSingleBeds) break; // All single beds filled

            const roomResult = findAndOccupyBed('single', student, currentHostelRoomsState);
            if (roomResult) {
                const { room, bed } = roomResult;
                allottedStudentsList.push(createAllotmentEntry(student, room, bed, 'single', dbUpdatePromises));
                singleRoomsAllottedCount++;
            } else {
                // If single not found for this high SGPA student, add to others for triple room consideration
                otherStudents.push(student); 
                otherStudents.sort((a,b) => b.averageSgpa - a.averageSgpa); // Re-sort with the new addition
            }
        }
        
        // Allot triple rooms to remaining students (those who preferred triple, or single-preference who didn't get single)
        for (const student of otherStudents) {
             // Check if student was already processed (e.g. got a single room - though logic above should prevent this specific double allotment)
            if (allottedStudentsList.some(as => as.studentProfileId.toString() === student._id.toString())) continue;

            const roomResult = findAndOccupyBed('triple', student, currentHostelRoomsState);
            if (roomResult) {
                const { room, bed } = roomResult;
                allottedStudentsList.push(createAllotmentEntry(student, room, bed, 'triple', dbUpdatePromises));
            } else {
                console.log(`Could not allot TRIPLE room for student ${student.name} (Roll: ${student.rollNumber}) using static data due to unavailability. All triple beds might be full or student already processed.`);
            }
        }

        await Promise.all(dbUpdatePromises);
        const finalAvailability = getRoomAvailabilityFromStaticData(currentHostelRoomsState);

        res.status(200).json({
            success: true,
            message: `Room allotment process completed for boys' hostel. ${allottedStudentsList.length} students allotted.`,
            allottedCount: allottedStudentsList.length,
            allottedStudents: allottedStudentsList,
            availability: finalAvailability,
        });

    } catch (error) {
        console.error('Error during room allotment with static data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during allotment with static data.',
            error: error.message
        });
    }
};

// Helper to find an available bed in a specific room type and mark it occupied in the currentRoomsData
function findAndOccupyBed(roomType, student, currentRoomsData) {
    for (const room of currentRoomsData) {
        if (room.hostelType === 'boys' && room.type === roomType && room.currentOccupancy < room.capacity) {
            for (const bed of room.beds) {
                if (!bed.studentId) { // If bed is not occupied
                    bed.studentId = student.userId._id.toString(); // Mark bed with User ID
                    bed.rollNumber = student.rollNumber;
                    bed.sgpa = student.averageSgpa;
                    room.currentOccupancy++;
                    return { room, bed };
                }
            }
        }
    }
    return null;
}

// Helper to create allotment DB entry and update student profile
function createAllotmentEntry(student, room, bed, allottedRoomType, dbUpdatePromises) {
    const allotmentData = {
        studentProfileId: student._id,
        userId: student.userId._id,
        name: student.name,
        rollNumber: student.rollNumber,
        courseName: student.courseName,
        semester: student.semester,
        sgpaOdd: student.sgpaOdd,
        sgpaEven: student.sgpaEven,
        averageSgpa: student.averageSgpa,
        roomPreference: student.roomPreference,
        allottedRoomType: allottedRoomType,
        allottedRoomNumber: room.roomNumber,
        allottedBedId: bed.bedId,
        allottedHostelType: 'boys', // Hardcoded for this controller
        floor: room.floor,
        allotmentDate: new Date(),
    };

    const newAllotment = new AllottedStudent(allotmentData);
    dbUpdatePromises.push(newAllotment.save());
    dbUpdatePromises.push(
        RegisteredStudentProfile.findByIdAndUpdate(student._id, {
            roomNumber: room.roomNumber,
            // bedId: bed.bedId, // Optional: if you want to store bedId in StudentProfile too
        })
    );
    return newAllotment.toObject(); // Return for the response list
}


// Helper function to get room availability counts from the static hostelRoomsData (or its current state copy)
const getRoomAvailabilityFromStaticData = (roomsData) => {
    let availability = {
        boys: {
            singleTotalBeds: 0,
            singleOccupiedBeds: 0,
            singleAvailableBeds: 0,
            tripleTotalBeds: 0,
            tripleOccupiedBeds: 0,
            tripleAvailableBeds: 0
        }
    };

    roomsData.forEach(room => {
        if (room.hostelType === 'boys') { // Ensure we only count boys hostel rooms from this data source
            if (room.type === 'single') {
                availability.boys.singleTotalBeds += room.capacity;
                availability.boys.singleOccupiedBeds += room.currentOccupancy;
            } else if (room.type === 'triple') {
                availability.boys.tripleTotalBeds += room.capacity;
                availability.boys.tripleOccupiedBeds += room.currentOccupancy;
            }
        }
    });

    availability.boys.singleAvailableBeds = availability.boys.singleTotalBeds - availability.boys.singleOccupiedBeds;
    availability.boys.tripleAvailableBeds = availability.boys.tripleTotalBeds - availability.boys.tripleOccupiedBeds;

    return availability;
};

// Endpoint to get current room availability (reflects the initial state of hostelRoomData.js)
exports.getRoomAvailability = async (req, res) => {
    try {
        // This reflects the base state of the hostel as defined in hostelRoomData.js
        // It does not reflect real-time DB occupancy unless you modify it to do so.
        const availability = getRoomAvailabilityFromStaticData(JSON.parse(JSON.stringify(baseHostelRoomsData))); 
        res.status(200).json({ success: true, availability });
    } catch (error) {
        console.error('Error in getRoomAvailability endpoint (static data):', error);
        res.status(500).json({ success: false, message: 'Server error fetching availability (static data).' });
    }
};

// New controller function to get all allotted students
exports.getAllAllottedStudents = async (req, res) => {
    try {
        const allottedStudents = await AllottedStudent.find({})
            .populate('studentProfileId', 'name rollNumber courseName semester sgpaOdd sgpaEven averageSgpa roomPreference') // Populate details from RegisteredStudentProfile
            .populate('userId', 'email'); // Populate user details like email if needed

        if (!allottedStudents || allottedStudents.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No students have been allotted rooms yet.",
                data: [],
                count: 0
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully retrieved allotted students.",
            data: allottedStudents,
            count: allottedStudents.length
        });

    } catch (error) {
        console.error('Error fetching allotted students:', error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve allotted students.",
            error: error.message
        });
    }
};

