import React, { useState, useEffect } from "react";
import {
  allotHostelRooms,
  getAllottedStudentsList,
  getRoomAvailability,
} from "../../services/auth"; // Import the new API functions
import { toast } from "react-hot-toast";

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
      console.log(
        "[HostelAllotment] Initial room availability result:",
        result
      );
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
      const formattedStudents = result.data.map((student) => ({
        Name: student.name,
        RollNo: student.rollNumber,
        Course: student.courseName,
        // Gender: student.studentProfileId?.userId?.gender || 'N/A', // Assuming gender is on User via StudentProfile. Let's get this from studentProfileId directly if populated
        Gender: student.studentProfileId?.gender || "N/A", // Check if gender is directly on studentProfileId after populate
        RoomPreference: student.roomPreference,
        HostelName:
          student.allottedHostelType === "boys"
            ? "Kautilya Hall"
            : "Other Hostel", // Adjust as needed
        // HostelId: student.allottedRoomNumber, // This was likely meant to be a static ID, using room number for now
        AllottedRoom: student.allottedRoomNumber,
        AllottedBed: student.allottedBedId,
        Floor: student.floor,
      }));
      console.log("[HostelAllotment] Formatted students:", formattedStudents);
      setStudents(formattedStudents);
      setAllotmentComplete(true);
    } else {
      console.log(
        "[HostelAllotment] No allotted students found or error fetching them."
      );
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
      toast.success(
        result.message || "Allotment process completed successfully!"
      );
      console.log(
        "[HostelAllotment] Allotment successful, now fetching updated student list and availability..."
      );
      await fetchAllottedStudents(); // Refresh the list of allotted students
      const updatedAvailability = await getRoomAvailability(); // Refresh availability
      console.log(
        "[HostelAllotment] Updated room availability result:",
        updatedAvailability
      );
      if (updatedAvailability && updatedAvailability.success) {
        setRoomAvailability(updatedAvailability.availability);
      }
    } else {
      toast.error(
        result?.message ||
          "Allotment process failed. Check console for details."
      );
      console.error(
        "[HostelAllotment] Allotment process failed. API response:",
        result
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-full sm:max-w-4xl min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-700">
        Hostel Allotment System (Kautilya Hall)
      </h1>

      <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
          Allotment Control
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Click the button below to initiate the automated room allotment
          process for Kautilya Hall (Boys' Hostel).
        </p>
        <button
          onClick={handleInitiateAllotment}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-md hover:bg-green-600 disabled:bg-gray-400 w-full sm:w-auto text-sm sm:text-base transition-colors duration-200"
        >
          {isLoading
            ? "Processing Allotment..."
            : "Initiate Kautilya Hall Allotment"}
        </button>
      </div>

      {roomAvailability && (
        <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
            Kautilya Hall Room Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                Single Rooms
              </h3>
              <p>Total Beds: {roomAvailability.boys?.singleTotalBeds || 0}</p>
              <p>Occupied: {roomAvailability.boys?.singleOccupiedBeds || 0}</p>
              <p className="text-green-600 font-semibold">
                Available: {roomAvailability.boys?.singleAvailableBeds || 0}
              </p>
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                Triple Rooms
              </h3>
              <p>Total Beds: {roomAvailability.boys?.tripleTotalBeds || 0}</p>
              <p>Occupied: {roomAvailability.boys?.tripleOccupiedBeds || 0}</p>
              <p className="text-green-600 font-semibold">
                Available: {roomAvailability.boys?.tripleAvailableBeds || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-center text-blue-500 py-4 text-sm sm:text-base">
          Loading allotment data...
        </p>
      )}

      {allotmentComplete && students.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
            Hostel Allotment Results
          </h2>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white text-xs sm:text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Roll No
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Course
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Preference
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Hostel
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider">
                    Room No
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Bed ID
                  </th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4 text-left font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Floor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr
                    key={student.RollNo || index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors duration-150`}
                  >
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap">
                      {student.Name}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                      {student.RollNo}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap hidden lg:table-cell">
                      {student.Course}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap">
                      {student.RoomPreference}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                      {student.HostelName}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap">
                      {student.AllottedRoom}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap hidden lg:table-cell">
                      {student.AllottedBed}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                      {student.Floor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Total Allotted Students: {students.length}
            </p>
          </div>
        </div>
      )}
      {allotmentComplete && students.length === 0 && !isLoading && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            No students are currently allotted to Kautilya Hall, or the
            allotment process has not been run yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default HostelAllotment;
