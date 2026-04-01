import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("table"); // table, card, analytics
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subscription: "Basic",
    course: "",
    gpa: 0,
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
  });

  // Fetch Students
  useEffect(() => {
    setStudents([
      {
        _id: "1",
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        mobile: "9876543210",
        subscription: "Premium",
        course: "MERN Stack",
        gpa: 3.8,
        enrollmentDate: "2024-01-15",
        status: "Active",
        parentName: "Mr. Sharma",
        parentEmail: "parent1@gmail.com",
        parentPhone: "9876543200",
      },
      {
        _id: "2",
        name: "Priya Patil",
        email: "priya@gmail.com",
        mobile: "9123456780",
        subscription: "Basic",
        course: "React JS",
        gpa: 3.5,
        enrollmentDate: "2024-02-20",
        status: "Active",
        parentName: "Mrs. Patil",
        parentEmail: "parent2@gmail.com",
        parentPhone: "9123456700",
      },
      {
        _id: "3",
        name: "Amit Kumar",
        email: "amit@gmail.com",
        mobile: "9988776655",
        subscription: "Free",
        course: "Node JS",
        gpa: 3.2,
        enrollmentDate: "2024-03-10",
        status: "Active",
        parentName: "Mr. Kumar",
        parentEmail: "parent3@gmail.com",
        parentPhone: "9988776600",
      },
    ]);
  }, []);

  // Apply Filters
  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchSubscription =
      subscriptionFilter === "All" || s.subscription === subscriptionFilter;
    const matchCourse = courseFilter === "All" || s.course === courseFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchSubscription && matchCourse && matchStatus;
  });

  // Get unique values
  const courses = Array.from(new Set(students.map((s) => s.course)));
  const subscriptions = ["Premium", "Basic", "Free"];

  // Calculate Analytics
  const analytics = {
    total: students.length,
    active: students.filter((s) => s.status === "Active").length,
    inactive: students.filter((s) => s.status === "Inactive").length,
    avgGpa: (
      students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length
    ).toFixed(2),
    subscriptionBreakdown: {
      premium: students.filter((s) => s.subscription === "Premium").length,
      basic: students.filter((s) => s.subscription === "Basic").length,
      free: students.filter((s) => s.subscription === "Free").length,
    },
    courseBreakdown: courses.map((course) => ({
      course,
      count: students.filter((s) => s.course === course).length,
    })),
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Edit Student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email) {
      showMessage("Please fill required fields", "error");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Edit
        setStudents(
          students.map((s) =>
            s._id === editingId ? { ...formData, _id: editingId } : s,
          ),
        );
        showMessage("Student updated successfully", "success");
      } else {
        // Add
        const newStudent = {
          ...formData,
          _id: Date.now().toString(),
        };
        setStudents([...students, newStudent]);
        showMessage("Student added successfully", "success");
      }

      resetForm();
    } catch (error) {
      showMessage("Error saving student", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Student
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((s) => s._id !== id));
      showMessage("Student deleted successfully", "success");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedStudents.size === 0) {
      showMessage("Select students to delete", "error");
      return;
    }

    if (window.confirm(`Delete ${selectedStudents.size} student(s)?`)) {
      setStudents(students.filter((s) => !selectedStudents.has(s._id)));
      setSelectedStudents(new Set());
      showMessage("Students deleted successfully", "success");
    }
  };

  // Edit Student
  const handleEdit = (student) => {
    setFormData(student);
    setEditingId(student._id);
    setShowForm(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      subscription: "Basic",
      course: "",
      gpa: 0,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Show Message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Subscription",
      "Course",
      "GPA",
      "Status",
    ];
    const rows = filtered.map((s) => [
      s.name,
      s.email,
      s.mobile,
      s.subscription,
      s.course,
      s.gpa,
      s.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    showMessage("CSV exported successfully", "success");
  };

  // Toggle Student Selection
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  // Toggle All Selection
  const toggleAllSelection = () => {
    if (selectedStudents.size === filtered.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filtered.map((s) => s._id)));
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          👥 Student Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track student information
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

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Total Students
          </p>
          <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Active Students
          </p>
          <p className="text-3xl font-bold text-green-600">
            {analytics.active}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Inactive Students
          </p>
          <p className="text-3xl font-bold text-red-600">
            {analytics.inactive}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Average GPA
          </p>
          <p className="text-3xl font-bold text-purple-600">
            {analytics.avgGpa}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Filtered Count
          </p>
          <p className="text-3xl font-bold text-orange-600">
            {filtered.length}
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        {/* Add Student & View Toggle */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? "❌ Cancel" : "➕ Add Student"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-lg transition ${
                view === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              📊 Table View
            </button>
            <button
              onClick={() => setView("card")}
              className={`px-4 py-2 rounded-lg transition ${
                view === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              🎴 Card View
            </button>
            <button
              onClick={() => setView("analytics")}
              className={`px-4 py-2 rounded-lg transition ${
                view === "analytics"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              📈 Analytics
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ⬇️ Export CSV
          </button>

          {selectedStudents.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              🗑️ Delete ({selectedStudents.size})
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option>All Subscriptions</option>
            {subscriptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option>All Courses</option>
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSubscriptionFilter("All");
              setCourseFilter("All");
              setStatusFilter("All");
              setSelectedStudents(new Set());
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            🔄 Reset Filters
          </button>
        </div>

        {/* Active Filters Summary */}
        {(search ||
          subscriptionFilter !== "All" ||
          courseFilter !== "All" ||
          statusFilter !== "All") && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🎯 Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
              {search && (
                <span className="bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Search: {search}
                </span>
              )}
              {subscriptionFilter !== "All" && (
                <span className="bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Subscription: {subscriptionFilter}
                </span>
              )}
              {courseFilter !== "All" && (
                <span className="bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Course: {courseFilter}
                </span>
              )}
              {statusFilter !== "All" && (
                <span className="bg-yellow-200 dark:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Status: {statusFilter}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 border-2 border-blue-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? "✏️ Edit Student" : "➕ Add New Student"}
          </h2>

          <form
            onSubmit={handleSaveStudent}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Full Name"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="student@example.com"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleFormChange}
                placeholder="Phone number"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleFormChange}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option>Select Course</option>
                {courses.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subscription */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Subscription
              </label>
              <select
                name="subscription"
                value={formData.subscription}
                onChange={handleFormChange}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option>Premium</option>
                <option>Basic</option>
                <option>Free</option>
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                GPA
              </label>
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleFormChange}
                placeholder="0.0"
                min="0"
                max="4"
                step="0.1"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Enrollment Date
              </label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleFormChange}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Parent Name
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleFormChange}
                placeholder="Parent Name"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Parent Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Parent Email
              </label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleFormChange}
                placeholder="Parent email"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Parent Phone
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleFormChange}
                placeholder="Parent phone"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "✅ Update Student"
                    : "✅ Add Student"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudents.size === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAllSelection}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Subscription</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">GPA</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(s._id)}
                        onChange={() => toggleSelection(s._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-white">
                      {s.name}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {s.email}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${
                          s.subscription === "Premium"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : s.subscription === "Basic"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {s.subscription}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {s.course || "N/A"}
                    </td>
                    <td className="p-3 font-semibold text-purple-600 dark:text-purple-400">
                      {s.gpa}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${
                          s.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
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

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {s.email}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStudents.has(s._id)}
                  onChange={() => toggleSelection(s._id)}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  📱 <span className="font-semibold">{s.mobile || "N/A"}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  📚 <span className="font-semibold">{s.course || "N/A"}</span>
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      s.subscription === "Premium"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : s.subscription === "Basic"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {s.subscription}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  ⭐ GPA: <span className="font-semibold">{s.gpa}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center p-8 text-gray-500 dark:text-gray-400">
              No students found
            </div>
          )}
        </div>
      )}

      {/* Analytics View */}
      {view === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Breakdown */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              💳 Subscription Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Premium
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.subscriptionBreakdown.premium / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-green-600 w-8">
                    {analytics.subscriptionBreakdown.premium}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Basic</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.subscriptionBreakdown.basic / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-yellow-600 w-8">
                    {analytics.subscriptionBreakdown.basic}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Free</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gray-600 h-2 rounded-full"
                      style={{
                        width: `${(analytics.subscriptionBreakdown.free / analytics.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-600 w-8">
                    {analytics.subscriptionBreakdown.free}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              📚 Course Distribution
            </h3>
            <div className="space-y-3">
              {analytics.courseBreakdown.map((item) => (
                <div
                  key={item.course}
                  className="flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 mb-1 text-sm">
                      {item.course}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / analytics.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-3 font-semibold text-blue-600 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              📊 Detailed Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {analytics.total}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  All registered
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {analytics.active}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {((analytics.active / analytics.total) * 100).toFixed(0)}% of
                  total
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300 mb-1">
                  Inactive Students
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {analytics.inactive}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {((analytics.inactive / analytics.total) * 100).toFixed(0)}%
                  of total
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                  Average GPA
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {analytics.avgGpa}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Class average
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
