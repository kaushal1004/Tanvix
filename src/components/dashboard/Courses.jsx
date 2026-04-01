import React, { useState } from "react";

const Courses = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">📚 My Courses</h2>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold">{course.title}</h3>
            <p>
              <strong>Code:</strong> {course.code}
            </p>
            <p>
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p>
              <strong>Duration:</strong> {course.duration}
            </p>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-sm">{course.progress}% Complete</p>
            </div>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${course.status === "Active" ? "bg-green-200" : "bg-gray-200"}`}
              >
                {course.status}
              </span>
            </p>
            <p>
              <strong>Dates:</strong> {course.startDate} - {course.endDate}
            </p>
            <div className="mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Continue Learning
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
