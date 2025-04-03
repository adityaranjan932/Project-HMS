import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaCalendarAlt,
  FaIdCard,
  FaImage,
  FaPen,
  FaUser,
} from "react-icons/fa";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-8 bg-gradient-to-r from-white to-gray-50 shadow-xl rounded-xl space-y-6 border border-gray-300"
      >
        <label className="block">
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaBook /> Course Name:
          </span>
          <select
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 hover:bg-gray-50 transition"
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
            <option value="13">
              B.Tech (Computer Science and Engineering)
            </option>
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
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaBook /> Semester:
          </span>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 hover:bg-gray-50 transition"
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
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaUser /> Roll No.:
          </span>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
            className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 hover:bg-gray-50 transition"
          />
        </label>
        <label className="block">
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaCalendarAlt /> Date of Birth:
          </span>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 hover:bg-gray-50 transition"
          />
        </label>
        <label className="block">
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaImage /> Photo:
          </span>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
            className="mt-2 block w-full text-gray-700 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition"
          />
        </label>
        <label className="block">
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaPen /> Signature:
          </span>
          <input
            type="file"
            name="signature"
            accept="image/*"
            onChange={handleChange}
            required
            className="mt-2 block w-full text-gray-700 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition"
          />
        </label>
        <label className="block">
          <span className="text-gray-900 font-semibold flex items-center gap-2">
            <FaIdCard /> Aadhar No.:
          </span>
          <input
            type="text"
            name="aadharNo"
            value={formData.aadharNo}
            onChange={handleChange}
            required
            className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 hover:bg-gray-50 transition"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition duration-300 flex items-center justify-center gap-2"
        >
          <FaPen /> Submit
        </button>
      </form>
    </div>
  );
};

export default Step1Register;
