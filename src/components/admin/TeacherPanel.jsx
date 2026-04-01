import React from "react";

const TeacherPanel = ({
  adminStats,
  teachers,
  courses,
  onOpenModal,
  onToggleUserStatus,
  onDeleteUser,
  onDeleteCourse,
}) => {
  return (
    <div className="space-y-6">
      {/* Advanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-blue-600">
            {adminStats.totalTeachers}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Teachers</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-green-600">
            {adminStats.totalCourses}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Courses</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-purple-600">
            {teachers.filter((t) => t.status === "Active").length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Active Teachers
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-orange-600">
            {(
              teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length
            ).toFixed(1)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Avg Rating</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-4xl font-bold text-red-600">
            {courses.filter((c) => c.status === "Active").length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Active Courses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Teachers Management */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Advanced Teacher Management
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenModal("addTeacher")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
              >
                + Add Teacher
              </button>
              <button
                onClick={() => onOpenModal("addCourse")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm"
              >
                + Course
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Teacher</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Courses</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {teacher.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {teacher.qualifications}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {teacher.experience} exp.
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {teacher.department}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {teacher.courses} courses
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-semibold">{teacher.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          teacher.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() =>
                            onToggleUserStatus(teacher.id, "teacher")
                          }
                          className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900 rounded"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => onOpenModal("editTeacher", teacher)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteUser(teacher.id, "teacher")}
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

        {/* Course Assignment & Management */}
        <div className="space-y-6">
          {/* Course Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Course Management
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Instructor: {course.instructor}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {course.students} students • {course.credits} credits •{" "}
                        {course.duration}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Dept: {course.department}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onOpenModal("assignCourse", course)}
                        className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 dark:bg-green-900 rounded"
                        title="Assign to Teacher"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 bg-red-50 dark:bg-red-900 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Overview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Department Overview
            </h3>
            <div className="space-y-3">
              {["Computer Science", "Mathematics", "English Literature"].map(
                (dept) => {
                  const deptTeachers = teachers.filter(
                    (t) => t.department === dept,
                  );
                  const deptCourses = courses.filter(
                    (c) => c.department === dept,
                  );
                  return (
                    <div
                      key={dept}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {dept}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="text-gray-600 dark:text-gray-400">
                          Teachers:{" "}
                          <span className="font-semibold">
                            {deptTeachers.length}
                          </span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Courses:{" "}
                          <span className="font-semibold">
                            {deptCourses.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Top Performing Teachers
          </h3>
          <div className="space-y-3">
            {teachers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((teacher, index) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white text-sm">
                        {teacher.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {teacher.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{teacher.rating}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Course Load Distribution
          </h3>
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {teacher.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(teacher.courses / Math.max(...teachers.map((t) => t.courses))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold w-8 text-right">
                    {teacher.courses}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
