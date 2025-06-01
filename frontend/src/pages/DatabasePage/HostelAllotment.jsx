import React, { useState, useEffect } from 'react';
import { allotHostelRooms, getAllottedStudentsList, getRoomAvailability } from '../../services/auth'; // Import the new API functions
import { toast } from 'react-hot-toast';

const HostelAllotment = () => {
  const [students, setStudents] = useState([]);
  const [allotmentComplete, setAllotmentComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState(null);

  // Fetch initial room availability
  useEffect(() => {
    const fetchAvailability = async () => {
      console.log("[HostelAllotment] Fetching initial room availability...");
      const result = await getRoomAvailability();
      console.log("[HostelAllotment] Initial room availability result:", result);
      if (result && result.success) {
        setRoomAvailability(result.availability);
      }
    };
    fetchAvailability();
  }, []);

  // Function to fetch allotted students
  const fetchAllottedStudents = async () => {
    console.log("[HostelAllotment] Fetching allotted students...");
    setIsLoading(true);
    const result = await getAllottedStudentsList();
    console.log("[HostelAllotment] Fetch allotted students result:", result);
    if (result && result.success && result.data) {
      const formattedStudents = result.data.map(student => ({
        Name: student.name,
        RollNo: student.rollNumber,
        Course: student.courseName,
        // Gender: student.studentProfileId?.userId?.gender || 'N/A', // Assuming gender is on User via StudentProfile. Let's get this from studentProfileId directly if populated
        Gender: student.studentProfileId?.gender || 'N/A', // Check if gender is directly on studentProfileId after populate
        RoomPreference: student.roomPreference,
        HostelName: student.allottedHostelType === 'boys' ? 'Kautilya Hall' : 'Other Hostel', // Adjust as needed
        // HostelId: student.allottedRoomNumber, // This was likely meant to be a static ID, using room number for now
        AllottedRoom: student.allottedRoomNumber,
        AllottedBed: student.allottedBedId,
        Floor: student.floor,
      }));
      console.log("[HostelAllotment] Formatted students:", formattedStudents);
      setStudents(formattedStudents);
      setAllotmentComplete(true);
    } else {
      console.log("[HostelAllotment] No allotted students found or error fetching them.");
      setStudents([]);
      setAllotmentComplete(true); // Still set to true to show the "no students" message if applicable
    }
    setIsLoading(false);
  };

  // Load allotted students when component mounts
  useEffect(() => {
    fetchAllottedStudents();
  }, []);

  const handleInitiateAllotment = async () => {
    console.log("[HostelAllotment] handleInitiateAllotment called");
    setIsLoading(true);
    const result = await allotHostelRooms(); // This function is in services/auth.js and has its own logs
    console.log("[HostelAllotment] allotHostelRooms API call result:", result);

    if (result && result.success) {
      toast.success(result.message || 'Allotment process completed successfully!');
      console.log("[HostelAllotment] Allotment successful, now fetching updated student list and availability...");
      await fetchAllottedStudents(); // Refresh the list of allotted students
      const updatedAvailability = await getRoomAvailability(); // Refresh availability
      console.log("[HostelAllotment] Updated room availability result:", updatedAvailability);
      if (updatedAvailability && updatedAvailability.success) {
        setRoomAvailability(updatedAvailability.availability);
      }
    } else {
      toast.error(result?.message || 'Allotment process failed. Check console for details.');
      console.error("[HostelAllotment] Allotment process failed. API response:", result);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-[screen]">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Hostel Allotment System (Kautilya Hall)</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Allotment Control</h2>
        <p className="text-sm text-gray-600 mb-4">Click the button below to initiate the automated room allotment process for Kautilya Hall (Boys' Hostel).</p>
        <button
          onClick={handleInitiateAllotment}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 w-full sm:w-auto"
        >
          {isLoading ? 'Processing Allotment...' : 'Initiate Kautilya Hall Allotment'}
        </button>
      </div>

      {roomAvailability && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Kautilya Hall Room Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Single Rooms</h3>
              <p>Total Beds: {roomAvailability.boys?.singleTotalBeds || 0}</p>
              <p>Occupied: {roomAvailability.boys?.singleOccupiedBeds || 0}</p>
              <p className="text-green-600 font-semibold">Available: {roomAvailability.boys?.singleAvailableBeds || 0}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Triple Rooms</h3>
              <p>Total Beds: {roomAvailability.boys?.tripleTotalBeds || 0}</p>
              <p>Occupied: {roomAvailability.boys?.tripleOccupiedBeds || 0}</p>
              <p className="text-green-600 font-semibold">Available: {roomAvailability.boys?.tripleAvailableBeds || 0}</p>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && <p className="text-center text-blue-600">Loading allotment data...</p>}

      {allotmentComplete && students.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">Hostel Allotment Results</h2>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Course</th>
                  {/* <th className="py-3 px-4 text-left">Gender</th> */}
                  <th className="py-3 px-4 text-left">Preference</th>
                  <th className="py-3 px-4 text-left">Hostel</th>
                  <th className="py-3 px-4 text-left">Room No</th>
                  <th className="py-3 px-4 text-left">Bed ID</th>
                  <th className="py-3 px-4 text-left">Floor</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.RollNo || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 border-b">{student.Name}</td>
                    <td className="py-3 px-4 border-b">{student.RollNo}</td>
                    <td className="py-3 px-4 border-b">{student.Course}</td>
                    {/* <td className="py-3 px-4 border-b">{student.Gender}</td> */}
                    <td className="py-3 px-4 border-b">{student.RoomPreference}</td>
                    <td className="py-3 px-4 border-b">{student.HostelName}</td>
                    <td className="py-3 px-4 border-b">{student.AllottedRoom}</td>
                    <td className="py-3 px-4 border-b">{student.AllottedBed}</td>
                    <td className="py-3 px-4 border-b">{student.Floor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total Allotted Students: {students.length}</p>
            {/* Removed download button as data is now live from backend */}
          </div>
        </div>
      )}
      {allotmentComplete && students.length === 0 && !isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No students are currently allotted to Kautilya Hall, or the allotment process has not been run yet.</p>
        </div>
      )}

    </div>  
  );
};

export default HostelAllotment;
