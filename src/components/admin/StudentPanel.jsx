import React from "react";

const StudentPanel = ({
  adminStats,
  students,
  assignments,
  onOpenModal,
  onToggleUserStatus,
  onDeleteUser,
  onPromoteToTeacher,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-blue-600">
            {adminStats.totalStudents}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Students</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-green-600">
            {adminStats.totalCourses}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Available Courses
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-purple-600">
            {assignments.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Active Assignments
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Enrolled Students
            </h3>
            <button
              onClick={() => onOpenModal("addStudent")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
            >
              + Add Student
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Courses</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">{student.enrolledCourses}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => onPromoteToTeacher(student.id)}
                          className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 dark:bg-green-900 rounded"
                          title="Promote to Teacher"
                        >
                          👨‍🏫 Promote
                        </button>
                        <button
                          onClick={() =>
                            onToggleUserStatus(student.id, "student")
                          }
                          className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900 rounded"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => onDeleteUser(student.id, "student")}
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 bg-red-50 dark:bg-red-900 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignments Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Assignments
          </h3>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                    {assignment.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Course: {assignment.course}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Due: {assignment.dueDate} | Submissions:{" "}
                    {assignment.submissions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
