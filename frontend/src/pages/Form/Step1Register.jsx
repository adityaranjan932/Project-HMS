import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step1Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: "",
    semester: "",
    examType: "",
    subjectName: "",
    rollNo: "",
    dob: "",
    photo: null,
    signature: null,
    aadharNo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here if needed
    navigate("/Step2EmailVerification");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
    >
      <label className="block">
        <span className="text-gray-700">Course Name:</span>
        <select
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Course</option>
          <option value="11">B.Tech (Civil Engineering)</option>
          <option value="153">B.Tech (Civil Engineering) NEP</option>
          <option value="12">
            B.Tech (Computer Science and Engineering- Artificial Intelligence)
          </option>
          <option value="154">
            B.Tech (Computer Science and Engineering- Artificial Intelligence)
            NEP
          </option>
          <option value="13">B.Tech (Computer Science and Engineering)</option>
          <option value="155">
            B.Tech (Computer Science and Engineering) NEP
          </option>
          <option value="14">B.Tech (Electrical Engineering)</option>
          <option value="156">B.Tech (Electrical Engineering) NEP</option>
          <option value="15">
            B.Tech (Electronics and Communication Engineering)
          </option>
          <option value="157">
            B.Tech (Electronics and Communication Engineering) NEP
          </option>
          <option value="16">B.Tech (Mechanical Engineering)</option>
          <option value="158">B.Tech (Mechanical Engineering) NEP</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-700">Semester:</span>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Semester</option>
          <option value="1">I</option>
          <option value="2">II</option>
          <option value="3">III</option>
          <option value="4">IV</option>
          <option value="5">V</option>
          <option value="6">VI</option>
          <option value="7">VII</option>
          <option value="8">VIII</option>
        </select>
      </label>
      <label className="block">
        <span className="text-gray-700">Roll No.:</span>
        <input
          type="text"
          name="rollNo"
          value={formData.rollNo}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Date of Birth:</span>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Photo:</span>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          required
          className="mt-1 block w-full text-gray-700"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Signature:</span>
        <input
          type="file"
          name="signature"
          accept="image/*"
          onChange={handleChange}
          required
          className="mt-1 block w-full text-gray-700"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Aadhar No.:</span>
        <input
          type="text"
          name="aadharNo"
          value={formData.aadharNo}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};

export default Step1Register;
