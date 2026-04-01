import React, { useState, useMemo } from "react";

// ✅ Initial Session Data
const initialSessionData = {
  "2025 First Semester": {
    courses: {
      Session1: [
        {
          id: "001",
          roll: "S1-101",
          name: "Amit Sharma",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Present" },
            { date: "2026-03-22", status: "Absent" },
          ],
        },
        {
          id: "002",
          roll: "S1-102",
          name: "Neha Patil",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Present" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
      ],
      Session2: [
        {
          id: "003",
          roll: "S2-101",
          name: "Rohit Mehta",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Late" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
        {
          id: "004",
          roll: "S2-102",
          name: "Pooja Singh",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Leave" },
            { date: "2026-03-21", status: "Present" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
      ],
    },
  },
  "2025 Second Semester": {
    courses: {
      Session3: [
        {
          id: "005",
          roll: "S3-101",
          name: "Rahul Verma",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Present" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
        {
          id: "006",
          roll: "S3-102",
          name: "Priya Sharma",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Absent" },
            { date: "2026-03-21", status: "Absent" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
      ],
      Session4: [
        {
          id: "007",
          roll: "S4-101",
          name: "Karan Patel",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Present" },
            { date: "2026-03-22", status: "Late" },
          ],
        },
        {
          id: "008",
          roll: "S4-102",
          name: "Sneha Reddy",
          status: "Present",
          history: [
            { date: "2026-03-20", status: "Present" },
            { date: "2026-03-21", status: "Leave" },
            { date: "2026-03-22", status: "Present" },
          ],
        },
      ],
    },
  },
};

export default function AttendanceUI() {
  const [sessionData, setSessionData] = useState(initialSessionData);
  const [session, setSession] = useState("2025 First Semester");
  const [courses, setCourses] = useState(
    Object.keys(sessionData[session].courses),
  );
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("2026-03-23");
  const [view, setView] = useState("table"); // table, calendar, analytics
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [startDate, setStartDate] = useState("2026-03-20");
  const [endDate, setEndDate] = useState("2026-03-23");
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionStartDate, setNewSessionStartDate] = useState("");
  const [newSessionEndDate, setNewSessionEndDate] = useState("");

  // ✅ Change Session
  const handleSessionChange = (e) => {
    const newSession = e.target.value;
    setSession(newSession);
    setCourses(Object.keys(sessionData[newSession].courses));
    setSelectedCourse(null);
    setStudents([]);
  };

  // ✅ Load Students
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    const courseStudents = JSON.parse(
      JSON.stringify(sessionData[session].courses[course]),
    );
    setStudents(courseStudents);
  };

  // ✅ Change Attendance
  const handleChange = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
  };

  // ✅ Create New Session
  const createNewSession = () => {
    if (!newSessionName.trim()) {
      showMessage("Please enter a session name", "error");
      return;
    }

    if (sessionData[newSessionName]) {
      showMessage("Session already exists", "error");
      return;
    }

    const newSessionData = {
      ...sessionData,
      [newSessionName]: {
        courses: {},
      },
    };

    setSessionData(newSessionData);
    setSession(newSessionName);
    setCourses([]);
    setSelectedCourse(null);
    setStudents([]);
    setShowCreateSession(false);
    setNewSessionName("");
    setNewSessionStartDate("");
    setNewSessionEndDate("");
    showMessage("Session created successfully", "success");
  };

  // ✅ Delete Session
  const deleteSession = (sessionToDelete) => {
    if (Object.keys(sessionData).length <= 1) {
      showMessage("Cannot delete the last session", "error");
      return;
    }

    if (
      window.confirm(`Are you sure you want to delete "${sessionToDelete}"?`)
    ) {
      const updatedData = { ...sessionData };
      delete updatedData[sessionToDelete];
      setSessionData(updatedData);

      // Switch to another session if current one is deleted
      if (session === sessionToDelete) {
        const remainingSessions = Object.keys(updatedData);
        setSession(remainingSessions[0]);
        setCourses(Object.keys(updatedData[remainingSessions[0]].courses));
        setSelectedCourse(null);
        setStudents([]);
      }

      showMessage("Session deleted successfully", "success");
    }
  };

  // ✅ Mark All Present
  const markAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, status: "Present" })));
    showMessage("All marked as Present", "success");
  };

  // ✅ Mark All Absent
  const markAllAbsent = () => {
    setStudents(students.map((s) => ({ ...s, status: "Absent" })));
    showMessage("All marked as Absent", "success");
  };

  // ✅ Save Attendance
  const saveAttendance = () => {
    if (!selectedCourse) {
      showMessage("Select a course first", "error");
      return;
    }
    console.log({ session, selectedCourse, date, students });
    showMessage("Attendance saved successfully", "success");
  };

  // ✅ Export CSV
  const exportToCSV = () => {
    if (!selectedCourse) {
      showMessage("Select a course first", "error");
      return;
    }
    const headers = ["ID", "Roll", "Name", "Status"];
    const rows = students.map((s) => [s.id, s.roll, s.name, s.status]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${selectedCourse}_${date}.csv`;
    a.click();
    showMessage("CSV exported successfully", "success");
  };

  // ✅ Show Message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ Calculate Analytics
  const analytics = useMemo(() => {
    const present = students.filter((s) => s.status === "Present").length;
    const absent = students.filter((s) => s.status === "Absent").length;
    const late = students.filter((s) => s.status === "Late").length;
    const leave = students.filter((s) => s.status === "Leave").length;
    const total = students.length;
    const presentPercentage =
      total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    // Calculate attendance percentage for each student
    const studentAttendance = students.map((s) => {
      const presentCount = (s.history || []).filter(
        (h) => h.status === "Present",
      ).length;
      const historyLength = (s.history || []).length;
      const percentage =
        historyLength > 0
          ? ((presentCount / historyLength) * 100).toFixed(1)
          : 0;
      return { ...s, percentage };
    });

    return {
      present,
      absent,
      late,
      leave,
      total,
      presentPercentage,
      studentAttendance,
    };
  }, [students]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          ✅ Attendance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage student attendance
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Session & Course Selection */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            📚 Session Management
          </h2>
          <button
            onClick={() => setShowCreateSession(!showCreateSession)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showCreateSession ? "❌ Cancel" : "➕ Create Session"}
          </button>
        </div>

        {/* Create Session Form */}
        {showCreateSession && (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4 border-2 border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Create New Session
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Session Name *
                </label>
                <input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., 2026 First Semester"
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newSessionStartDate}
                  onChange={(e) => setNewSessionStartDate(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newSessionEndDate}
                  onChange={(e) => setNewSessionEndDate(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={createNewSession}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                ✅ Create Session
              </button>
              <button
                onClick={() => {
                  setShowCreateSession(false);
                  setNewSessionName("");
                  setNewSessionStartDate("");
                  setNewSessionEndDate("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Session
            </label>
            <div className="flex gap-2">
              <select
                value={session}
                onChange={handleSessionChange}
                className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {Object.keys(sessionData).map((sessionName) => (
                  <option key={sessionName} value={sessionName}>
                    {sessionName}
                  </option>
                ))}
              </select>
              {Object.keys(sessionData).length > 1 && (
                <button
                  onClick={() => deleteSession(session)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                  title="Delete Session"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={markAllPresent}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              ✅ Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              ❌ Mark All Absent
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Current Session:</strong> {session} |
            <strong> Courses:</strong> {courses.length} |
            <strong> Total Sessions:</strong> {Object.keys(sessionData).length}
          </p>
        </div>

        {/* Course Selection */}
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => handleCourseClick(course)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCourse === course
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              {course}
            </button>
          ))}
          {courses.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No courses available in this session. Create courses to get
              started.
            </p>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      {selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Total Students
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {analytics.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Present</p>
            <p className="text-3xl font-bold text-green-600">
              {analytics.present}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Absent</p>
            <p className="text-3xl font-bold text-red-600">
              {analytics.absent}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Late</p>
            <p className="text-3xl font-bold text-yellow-600">
              {analytics.late}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Attendance %
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {analytics.presentPercentage}%
            </p>
          </div>
        </div>
      )}

      {/* View Toggle & Search */}
      {selectedCourse && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView("table")}
                className={`px-4 py-2 rounded-lg transition ${
                  view === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                📊 Table View
              </button>
              <button
                onClick={() => setView("analytics")}
                className={`px-4 py-2 rounded-lg transition ${
                  view === "analytics"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                📈 Analytics
              </button>
            </div>

            <input
              type="text"
              placeholder="🔍 Search by name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              ⬇️ Export CSV
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveAttendance}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              💾 Save Attendance
            </button>
            <button
              onClick={() => setSearch("")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              🔄 Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Table View */}
      {selectedCourse && view === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Roll</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-white">
                      {s.id}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white font-semibold">
                      {s.roll}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white">
                      {s.name}
                    </td>
                    <td className="p-3">
                      <select
                        value={s.status}
                        onChange={(e) =>
                          handleChange(students.indexOf(s), e.target.value)
                        }
                        className={`border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          s.status === "Present"
                            ? "border-green-500"
                            : s.status === "Absent"
                              ? "border-red-500"
                              : s.status === "Late"
                                ? "border-yellow-500"
                                : "border-blue-500"
                        }`}
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                        <option>Leave</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              s.percentage >= 80
                                ? "bg-green-600"
                                : s.percentage >= 60
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }`}
                            style={{ width: `${s.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-sm w-12">
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-6 text-gray-500 dark:text-gray-400"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics View */}
      {selectedCourse && view === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              📊 Status Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    Present
                  </span>
                  <span className="font-semibold text-green-600">
                    {analytics.present}/{analytics.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{
                      width: `${(analytics.present / analytics.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    Absent
                  </span>
                  <span className="font-semibold text-red-600">
                    {analytics.absent}/{analytics.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full"
                    style={{
                      width: `${(analytics.absent / analytics.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Late</span>
                  <span className="font-semibold text-yellow-600">
                    {analytics.late}/{analytics.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full"
                    style={{
                      width: `${(analytics.late / analytics.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    Leave
                  </span>
                  <span className="font-semibold text-blue-600">
                    {analytics.leave}/{analytics.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${(analytics.leave / analytics.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Attendance Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              👤 Student Attendance
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics.studentAttendance
                .sort((a, b) => b.percentage - a.percentage)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {s.roll}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${s.percentage >= 75 ? "text-green-600" : "text-red-600"}`}
                      >
                        {s.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              📋 Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.total}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Class Attendance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.presentPercentage}%
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Present
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.present.toFixed(0)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Absent
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {analytics.absent.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
