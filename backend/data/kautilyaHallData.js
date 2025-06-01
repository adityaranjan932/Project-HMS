const hostelRoomsData = [];

const floors = ['A', 'B', 'C'];
const singleRoomsPerFloor = 5;
const tripleRoomsPerFloor = 15;

// Generate Single Rooms
floors.forEach(floor => {
  for (let i = 1; i <= singleRoomsPerFloor; i++) {
    hostelRoomsData.push({
      roomNumber: `S${floor}${i}`,
      type: 'single',
      floor: floor,
      capacity: 1,
      hostelType: 'boys', // Assuming this data is for a boys' hostel
      // beds array will store the User._id of the allotted student directly
      // and other relevant details for easier lookup during allotment.
      beds: [{ bedId: `S${floor}${i}-1`, studentId: null, rollNumber: null, sgpa: 0 }] 
    });
  }
});

// Generate Triple Rooms
floors.forEach(floor => {
  for (let i = 1; i <= tripleRoomsPerFloor; i++) {
    const beds = [];
    for (let j = 1; j <= 3; j++) {
      // studentId will be User._id, rollNumber for quick reference if needed
      beds.push({ bedId: `T${floor}${i}-${j}`, studentId: null, rollNumber: null, sgpa: 0 });
    }
    hostelRoomsData.push({
      roomNumber: `T${floor}${i}`,
      type: 'triple',
      floor: floor,
      hostelType: 'boys', // Assuming this data is for a boys' hostel
      capacity: 3,
      beds: beds // Array of bed objects
    });
  }
});

module.exports = hostelRoomsData;
