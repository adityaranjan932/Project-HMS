import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../services/apiconnector';

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await apiConnector(
          'GET',
          '/auth/registered-students'
        );

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError('Failed to fetch student data');
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleExpandStudent = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  // Function to download JSON data
  const downloadJSON = () => {
    // Map the students data to include only the specified fields
    const dataToDownload = students.map(student => ({
      Name: student.name,
      FatherName: student.fatherName,
      MotherName: student.motherName,
      RollNo: student.rollNumber,
      Gender: student.gender,
      Course: student.courseName,
      Semester: student.semester,
      RoomPreference: student.roomPreference,
      ContactNumber: student.contactNumber,
      AdmissionYear: student.admissionYear,

    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToDownload, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'student_profiles.json';
    link.click();
  };

  if (loading) return <div className="text-center py-8 text-lg">Loading student data...</div>;
  if (error) return <div className="text-center py-8 text-lg text-red-600">{error}</div>;

  return (
    <>
      
      <div className="max-w-full max-h-screen  mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Student Profiles</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={downloadJSON}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Download JSON
          </button>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Roll Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Semester</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SGPA (Odd)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SGPA (Even)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Room Preference</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <React.Fragment key={student._id}>
                  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sgpaOdd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sgpaEven}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{student.roomPreference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition duration-200"
                        onClick={() => toggleExpandStudent(student._id)}
                      >
                        {expandedStudent === student._id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedStudent === student._id && (
                    <tr className="bg-blue-50">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-blue-800">Personal Information</h3>
                            <p><span className="font-medium">Father's Name:</span> {student.fatherName}</p>
                            <p><span className="font-medium">Mother's Name:</span> {student.motherName}</p>
                            <p><span className="font-medium">Gender:</span> {student.gender}</p>
                            <p><span className="font-medium">Contact:</span> {student.contactNumber}</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-blue-800">Academic Information</h3>
                            <p><span className="font-medium">Course:</span> {student.courseName}</p>
                            <p><span className="font-medium">Department:</span> {student.department}</p>
                            <p><span className="font-medium">Admission Year:</span> {student.admissionYear}</p>
                            <p><span className="font-medium">Semester:</span> {student.semester}</p>
                            <p><span className="font-medium">SGPA (Odd):</span> {student.sgpaOdd}</p>
                            <p><span className="font-medium">SGPA (Even):</span> {student.sgpaEven}</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-blue-800">Hostel Information</h3>
                            <p><span className="font-medium">Room Preference:</span> {student.roomPreference}</p>
                            <p><span className="font-medium">Room Number:</span> {student.roomNumber || 'Not Assigned'}</p>
                            <p><span className="font-medium">Eligibility:</span> {student.isEligible ? 'Eligible' : 'Not Eligible'}</p>
                            <p><span className="font-medium">User ID:</span> {student.userId}</p>
                            <p><span className="font-medium">Student ID:</span> {student._id}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right text-gray-700 font-medium">
          <p>Total Students: {students.length}</p>
        </div>
      </div>

    </>
    

  );
}

export default StudentTable;
