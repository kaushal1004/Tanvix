import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];
const ASSESSMENT_TYPES = [
  "Quiz",
  "Exam",
  "Assignment",
  "Project",
  "Presentation",
  "Lab",
];

export default function StudentAssessment() {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [form, setForm] = useState({
    studentName: "",
    subject: "",
    assessmentType: "Quiz",
    marks: "",
    maxMarks: "100",
    weightage: "10",
    date: new Date().toISOString().split("T")[0],
    comments: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [gradeThresholds, setGradeThresholds] = useState({
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0,
  });
  const [viewMode, setViewMode] = useState("list"); // list, analytics, trends

  const fetchAssessments = async () => {
    const res = await API.get("/assessments");
    setAssessments(res.data);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getGrade = (marks, maxMarks = 100) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= gradeThresholds.A) return "A";
    if (percentage >= gradeThresholds.B) return "B";
    if (percentage >= gradeThresholds.C) return "C";
    if (percentage >= gradeThresholds.D) return "D";
    return "F";
  };

  const calculateWeightedScore = (assessments) => {
    const studentGroups = {};

    assessments.forEach((assessment) => {
      if (!studentGroups[assessment.studentName]) {
        studentGroups[assessment.studentName] = [];
      }
      studentGroups[assessment.studentName].push(assessment);
    });

    const results = [];
    Object.keys(studentGroups).forEach((student) => {
      const studentAssessments = studentGroups[student];
      let totalWeightedScore = 0;
      let totalWeightage = 0;

      studentAssessments.forEach((assessment) => {
        const percentage = (assessment.marks / assessment.maxMarks) * 100;
        const weight = parseFloat(assessment.weightage);
        totalWeightedScore += (percentage * weight) / 100;
        totalWeightage += weight;
      });

      const finalScore =
        totalWeightage > 0 ? (totalWeightedScore / totalWeightage) * 100 : 0;
      results.push({
        studentName: student,
        finalScore: finalScore.toFixed(2),
        grade: getGrade(finalScore, 100),
        assessments: studentAssessments.length,
      });
    });

    return results;
  };

  const handleSubmit = async () => {
    if (
      !form.studentName ||
      !form.subject ||
      !form.marks ||
      !form.maxMarks ||
      !form.weightage
    ) {
      alert("All required fields must be filled");
      return;
    }

    const marks = parseFloat(form.marks);
    const maxMarks = parseFloat(form.maxMarks);

    if (marks > maxMarks) {
      alert("Marks cannot exceed maximum marks");
      return;
    }

    if (editingId) {
      await API.put(`/assessments/${editingId}`, form);
      setEditingId(null);
    } else {
      await API.post("/assessments", form);
    }

    setForm({
      studentName: "",
      subject: "",
      assessmentType: "Quiz",
      marks: "",
      maxMarks: "100",
      weightage: "10",
      date: new Date().toISOString().split("T")[0],
      comments: "",
    });
    fetchAssessments();
  };

  const handleBulkDelete = async () => {
    const selectedIds = assessments.filter((a) => a.selected).map((a) => a._id);
    if (selectedIds.length === 0) {
      alert("Please select assessments to delete");
      return;
    }

    if (window.confirm(`Delete ${selectedIds.length} assessments?`)) {
      for (const id of selectedIds) {
        await API.delete(`/assessments/${id}`);
      }
      fetchAssessments();
    }
  };

  const handleSelectAssessment = (id) => {
    setAssessments(
      assessments.map((a) =>
        a._id === id ? { ...a, selected: !a.selected } : a,
      ),
    );
  };

  const handleSelectAll = () => {
    const allSelected = filteredAssessments.every((a) => a.selected);
    setAssessments(
      assessments.map((a) =>
        filteredAssessments.find((fa) => fa._id === a._id)
          ? { ...a, selected: !allSelected }
          : a,
      ),
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Student Name",
      "Subject",
      "Type",
      "Marks",
      "Max Marks",
      "Percentage",
      "Grade",
      "Weightage",
      "Date",
      "Comments",
    ];
    const csvData = filteredAssessments.map((a) => [
      a.studentName,
      a.subject,
      a.assessmentType || "N/A",
      a.marks,
      a.maxMarks || 100,
      ((a.marks / (a.maxMarks || 100)) * 100).toFixed(2) + "%",
      getGrade(a.marks, a.maxMarks || 100),
      a.weightage || "N/A",
      a.date || "N/A",
      a.comments || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_assessments.csv";
    a.click();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/assessments/${id}`);
    fetchAssessments();
  };

  // Advanced Filtering
  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !filterSubject || a.subject === filterSubject;
    const matchesType = !filterType || a.assessmentType === filterType;
    const matchesDate =
      (!dateRange.start || a.date >= dateRange.start) &&
      (!dateRange.end || a.date <= dateRange.end);

    return matchesSearch && matchesSubject && matchesType && matchesDate;
  });

  // Enhanced Analytics
  const analytics = () => {
    const total = filteredAssessments.length;
    const avg =
      total > 0
        ? (
            filteredAssessments.reduce(
              (sum, a) => sum + (a.marks / (a.maxMarks || 100)) * 100,
              0,
            ) / total
          ).toFixed(2)
        : 0;
    const top =
      total > 0
        ? Math.max(
            ...filteredAssessments.map(
              (a) => (a.marks / (a.maxMarks || 100)) * 100,
            ),
          )
        : 0;

    // Grade distribution
    const gradeCount = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    filteredAssessments.forEach((a) => {
      gradeCount[getGrade(a.marks, a.maxMarks || 100)]++;
    });

    // Subject-wise performance
    const subjectStats = {};
    filteredAssessments.forEach((a) => {
      if (!subjectStats[a.subject]) {
        subjectStats[a.subject] = { total: 0, count: 0, avg: 0 };
      }
      subjectStats[a.subject].total += (a.marks / (a.maxMarks || 100)) * 100;
      subjectStats[a.subject].count++;
      subjectStats[a.subject].avg = (
        subjectStats[a.subject].total / subjectStats[a.subject].count
      ).toFixed(2);
    });

    // Type-wise performance
    const typeStats = {};
    filteredAssessments.forEach((a) => {
      if (!typeStats[a.assessmentType || "N/A"]) {
        typeStats[a.assessmentType || "N/A"] = { total: 0, count: 0, avg: 0 };
      }
      typeStats[a.assessmentType || "N/A"].total +=
        (a.marks / (a.maxMarks || 100)) * 100;
      typeStats[a.assessmentType || "N/A"].count++;
      typeStats[a.assessmentType || "N/A"].avg = (
        typeStats[a.assessmentType || "N/A"].total /
        typeStats[a.assessmentType || "N/A"].count
      ).toFixed(2);
    });

    return { total, avg, top, gradeCount, subjectStats, typeStats };
  };

  const stats = analytics();
  const weightedResults = calculateWeightedScore(filteredAssessments);

  // Chart Data
  const gradeChartData = Object.keys(stats.gradeCount).map((key) => ({
    name: key,
    value: stats.gradeCount[key],
  }));

  const subjectChartData = Object.keys(stats.subjectStats).map((subject) => ({
    subject,
    average: parseFloat(stats.subjectStats[subject].avg),
  }));

  const typeChartData = Object.keys(stats.typeStats).map((type) => ({
    type,
    average: parseFloat(stats.typeStats[type].avg),
  }));

  // Unique subjects and types for filters
  const uniqueSubjects = [...new Set(assessments.map((a) => a.subject))];
  const uniqueTypes = [
    ...new Set(assessments.map((a) => a.assessmentType).filter(Boolean)),
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Advanced Student Assessment System
        </h1>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Assessment List
          </button>
          <button
            onClick={() => setViewMode("analytics")}
            className={`px-4 py-2 rounded ${viewMode === "analytics" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setViewMode("trends")}
            className={`px-4 py-2 rounded ${viewMode === "trends" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Student Performance
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Enhanced Form */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Assessment" : "Add New Assessment"}
            </h3>

            <div className="space-y-4">
              <input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Student Name *"
                className="border p-3 w-full rounded"
                required
              />

              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject *"
                className="border p-3 w-full rounded"
                required
              />

              <select
                name="assessmentType"
                value={form.assessmentType}
                onChange={handleChange}
                className="border p-3 w-full rounded"
              >
                {ASSESSMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="marks"
                  value={form.marks}
                  onChange={handleChange}
                  type="number"
                  placeholder="Marks *"
                  className="border p-3 rounded"
                  required
                />
                <input
                  name="maxMarks"
                  value={form.maxMarks}
                  onChange={handleChange}
                  type="number"
                  placeholder="Max Marks *"
                  className="border p-3 rounded"
                  required
                />
              </div>

              <input
                name="weightage"
                value={form.weightage}
                onChange={handleChange}
                type="number"
                placeholder="Weightage (%) *"
                className="border p-3 w-full rounded"
                required
              />

              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                className="border p-3 w-full rounded"
              />

              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                placeholder="Comments/Feedback"
                className="border p-3 w-full rounded h-20"
              />

              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-6 py-3 rounded w-full font-semibold hover:bg-purple-700"
              >
                {editingId ? "Update Assessment" : "Add Assessment"}
              </button>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🔍</span> Search & Filter
            </h3>

            {/* Search Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quick Search
              </label>
              <input
                placeholder="Search by student name or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Type to instantly filter assessments
              </p>
            </div>

            {/* Filter Categories */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📚</span> Filter by Category
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        📖 {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "Quiz" && "📝"}
                        {type === "Exam" && "📋"}
                        {type === "Assignment" && "📄"}
                        {type === "Project" && "🚀"}
                        {type === "Presentation" && "🎤"}
                        {type === "Lab" && "🧪"} {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📅</span> Filter by Date
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Leave empty to include all dates
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚡</span> Actions
              </h4>
              <div className="space-y-3">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg w-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <span>📊</span> Export Data to CSV
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Download all filtered assessments as spreadsheet
                </p>

                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-3 rounded-lg w-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <span>🗑️</span> Delete Selected
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Select assessments from the list to delete multiple at once
                </p>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(search ||
              filterSubject ||
              filterType ||
              dateRange.start ||
              dateRange.end) && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-sm font-semibold text-blue-800 mb-2">
                  Active Filters:
                </h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {search && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Search: "{search}"
                    </span>
                  )}
                  {filterSubject && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Subject: {filterSubject}
                    </span>
                  )}
                  {filterType && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Type: {filterType}
                    </span>
                  )}
                  {dateRange.start && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      From: {dateRange.start}
                    </span>
                  )}
                  {dateRange.end && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      To: {dateRange.end}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterSubject("");
                    setFilterType("");
                    setDateRange({ start: "", end: "" });
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-2 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Assessment List */}
          <div className="bg-white p-6 shadow-lg rounded-lg lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">Assessment List</h3>
                <p className="text-sm text-gray-600">
                  Showing {filteredAssessments.length} of {assessments.length}{" "}
                  assessments
                </p>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
              >
                {filteredAssessments.every((a) => a.selected)
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredAssessments.map((a) => (
                <div
                  key={a._id}
                  className={`border p-4 rounded-lg hover:shadow-md transition-shadow ${
                    a.selected ? "border-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={a.selected || false}
                      onChange={() => handleSelectAssessment(a._id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {a.studentName}
                          </h4>
                          <p className="text-gray-600">
                            {a.subject} - {a.assessmentType || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl">
                            {a.marks}/{a.maxMarks || 100}
                          </p>
                          <p
                            className={`font-semibold ${
                              getGrade(a.marks, a.maxMarks || 100) === "A"
                                ? "text-green-600"
                                : getGrade(a.marks, a.maxMarks || 100) === "B"
                                  ? "text-blue-600"
                                  : getGrade(a.marks, a.maxMarks || 100) === "C"
                                    ? "text-yellow-600"
                                    : getGrade(a.marks, a.maxMarks || 100) ===
                                        "D"
                                      ? "text-orange-600"
                                      : "text-red-600"
                            }`}
                          >
                            {getGrade(a.marks, a.maxMarks || 100)} (
                            {((a.marks / (a.maxMarks || 100)) * 100).toFixed(1)}
                            %)
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-2">
                        <p>
                          Weightage: {a.weightage || "N/A"}% | Date:{" "}
                          {a.date || "N/A"}
                        </p>
                      </div>

                      {a.comments && (
                        <p className="text-sm text-gray-700 italic">
                          "{a.comments}"
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(a)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAssessments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    No assessments found
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterSubject("");
                      setFilterType("");
                      setDateRange({ start: "", end: "" });
                    }}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeChartData}
                  dataKey="value"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {gradeChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Performance */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">Subject-wise Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assessment Type Performance */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">
              Assessment Type Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Total Assessments</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {stats.avg}%
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.top.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Top Score</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    Object.values(stats.gradeCount).filter((count) => count > 0)
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Active Grades</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "trends" && (
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold mb-4">
              Student Performance Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Final Score</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                    <th className="px-4 py-2 text-left">Assessments</th>
                  </tr>
                </thead>
                <tbody>
                  {weightedResults.map((student, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-semibold">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-2">{student.finalScore}%</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            student.grade === "A"
                              ? "bg-green-600"
                              : student.grade === "B"
                                ? "bg-blue-600"
                                : student.grade === "C"
                                  ? "bg-yellow-600"
                                  : student.grade === "D"
                                    ? "bg-orange-600"
                                    : "bg-red-600"
                          }`}
                        >
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-2">{student.assessments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
