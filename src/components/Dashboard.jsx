import React from "react";
import Rating from "./Rating";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Teacher Panel 👋</h1>
        <p className="text-blue-100">
          Manage your classes, courses, students, and assessments from here.
        </p>
      </div>

      {/* Quick Stats / Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="font-bold text-lg mb-1">Classes</h3>
          <p className="text-gray-600 text-sm">
            Create and manage your classes
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">📖</div>
          <h3 className="font-bold text-lg mb-1">Courses</h3>
          <p className="text-gray-600 text-sm">
            Organize and update your courses
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-bold text-lg mb-1">Messages</h3>
          <p className="text-gray-600 text-sm">Communicate with students</p>
        </div>
      </div>

      {/* Rating Section */}
      <Rating />
    </div>
  );
}
