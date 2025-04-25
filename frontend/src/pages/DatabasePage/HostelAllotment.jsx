import React, { useState, useEffect } from 'react';

const hostelMapping = [
  {
    gender: 'male',
    courses: ['b.tech', 'bca', 'bba', 'b.pharma', 'mba', 'mca'],
    hostelName: 'Kautilya Hall',
    hostelId: 'LUKH001'
  },
  {
    gender: 'male',
    courses: ['law'],
    hostelName: 'HJB Hall',
    hostelId: 'LUHH002'
  }
];

const HostelAllotment = () => {
  const [students, setStudents] = useState([]);
  const [allotmentComplete, setAllotmentComplete] = useState(false);

  // // Load data from localStorage when component mounts
  // useEffect(() => {
  //   const savedStudents = localStorage.getItem('allottedStudents');
  //   if (savedStudents) {
  //     setStudents(JSON.parse(savedStudents));
  //     setAllotmentComplete(true);
  //   }
  // }, []);

  // Save data to localStorage whenever students state changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('allottedStudents', JSON.stringify(students));
    }
  }, [students]);

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const allottedStudents = data.map(student => {
          let hostelName = '';
          let hostelId = '';

          // Use the hostelMapping variable to determine the hostel
          for (const mapping of hostelMapping) {
            if (student.Gender.toLowerCase() === mapping.gender) {
              if (mapping.courses.some(course => student.Course.toLowerCase().includes(course))) {
                hostelName = mapping.hostelName;
                hostelId = mapping.hostelId;
                break;
              }
            }
          }

          return {
            ...student,
            HostelName: hostelName,
            HostelId: hostelId
          };
        });

        setStudents(allottedStudents);
        setAllotmentComplete(true);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Invalid JSON file. Please upload a valid file.");
      }
    };
    fileReader.onerror = (error) => {
      console.error("File reading error:", error);
      alert("Error reading file. Please try again.");
    };
  };

  const handleDownload = () => {
    // Include all original fields plus the hostel information
    const dataToDownload = students.map(student => ({
      ...student,
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToDownload, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'hostel_allotment.json';
    link.click();
  };

  // Function to manually save data
  const handleSaveData = () => {
    localStorage.setItem('allottedStudents', JSON.stringify(students));
    alert('Data saved successfully!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-[screen]">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Hostel Allotment System</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upload Student Data</h2>
        <div className="flex items-center justify-center w-full">
          <label 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-blue-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-blue-500">JSON file with student data</p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              accept=".json,application/json" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
      
      {allotmentComplete && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">Hostel Allotment Results</h2>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-left">Course</th>
                  <th className="py-3 px-4 text-left">Gender</th>
                  <th className="py-3 px-4 text-left">Room Preference</th>
                  <th className="py-3 px-4 text-left">Hostel Name</th>
                  <th className="py-3 px-4 text-left">Hostel ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 border-b">{student.Name}</td>
                    <td className="py-3 px-4 border-b">{student.RollNo}</td>
                    <td className="py-3 px-4 border-b">{student.Course}</td>
                    <td className="py-3 px-4 border-b">{student.Gender}</td>
                    <td className="py-3 px-4 border-b">{student.RoomPreference}</td>
                    <td className="py-3 px-4 border-b">{student.HostelName || 'Not Eligible'}</td>
                    <td className="py-3 px-4 border-b">{student.HostelId || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download Allotment JSON
              </button>
              {/* <button
                onClick={handleSaveData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Data
              </button> */}
            </div>
            <div className="text-sm text-gray-600">
              <p>Total Students: {students.length}</p>
              <p>Allotted: {students.filter(s => s.HostelName).length}</p>
              <p>Not Eligible: {students.filter(s => !s.HostelName).length}</p>
            </div>
          </div>
        </div>
      )}

    </div>  
  );
};

export default HostelAllotment;
