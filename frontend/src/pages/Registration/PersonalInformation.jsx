import React, { useEffect, useState } from "react";
import coursesData from "../../../utils/courseNameData.json";

const CourseRegistrationForm = ({ formData, handleChange }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(coursesData);
  }, []);

  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name *
          </label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name *
          </label>
          <select
            name="subject"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Subject</option>
            <option value={formData.course}>
              {formData.course
                ? document.querySelector(`option[value="${formData.course}"]`)
                    ?.textContent || "Selected Course"
                : "Select a Course First"}
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester *
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type *
          </label>
          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="">Exam Type</option>
            <option value="regular">Regular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll No. *
          </label>
          <input
            type="text"
            name="rollno"
            value={formData.rollno}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="Enter your roll number"
            maxLength="15"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth (DD/MM/YYYY) *
          </label>
          <input
            type="text"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            required
            placeholder="DD/MM/YYYY"
            maxLength="10"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Fields marked with * are required
      </div>
    </div>
  );
};

export default CourseRegistrationForm;
