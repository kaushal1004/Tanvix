import React, { useState } from "react";

const Assignments = ({ assignments }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState("submissionDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [assignmentState, setAssignmentState] = useState(
    assignments.map((assignment) => ({
      ...assignment,
      grade: assignment.marks
        ? parseInt(assignment.marks.split("/")[0], 10)
        : null,
      computedProgress: assignment.marks
        ? parseInt(assignment.marks.split("/")[0], 10)
        : 0,
    })),
  );

  const filteredAssignments = assignmentState
    .filter(
      (assignment) =>
        filterStatus === "All" || assignment.status === filterStatus,
    )
    .sort((a, b) => {
      if (sortKey === "submissionDate") {
        const aDate = new Date(a.submissionDate);
        const bDate = new Date(b.submissionDate);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortKey === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortKey === "grade") {
        return sortOrder === "asc"
          ? (a.grade || 0) - (b.grade || 0)
          : (b.grade || 0) - (a.grade || 0);
      }
      return 0;
    });

  const handleMarkSubmitted = (index) => {
    setAssignmentState((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              status: "Submitted",
              submissionDate: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    );
  };

  const handleGradeChange = (index, value) => {
    const numeric = Number(value);
    setAssignmentState((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              grade: Number.isNaN(numeric) ? null : numeric,
              marks: Number.isNaN(numeric) ? "" : `${numeric}/100`,
              computedProgress: Number.isNaN(numeric) ? 0 : numeric,
            }
          : item,
      ),
    );
  };

  const handleFeedbackChange = (index, value) => {
    setAssignmentState((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, feedback: value } : item,
      ),
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">
        📝 Assignments & Assessments
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
            <option value="Late">Late</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="submissionDate">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="grade">Sort by Grade</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="bg-blue-700 text-white p-2 rounded-md"
          >
            Order {sortOrder.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => {
          const isLate =
            assignment.status === "Pending" &&
            new Date(assignment.submissionDate) < new Date();
          const statusClass =
            assignment.status === "Submitted"
              ? "bg-green-100 text-green-800"
              : isLate
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800";

          return (
            <div
              key={assignment.title + index}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.subject}</p>
                  <p className="text-sm text-gray-600">
                    Due: {assignment.submissionDate}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                >
                  {isLate ? "Late" : assignment.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignment.grade ?? ""}
                    onChange={(e) => handleGradeChange(index, e.target.value)}
                    className="border rounded w-full p-2"
                    placeholder="0-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Feedback
                  </label>
                  <textarea
                    value={assignment.feedback || ""}
                    onChange={(e) =>
                      handleFeedbackChange(index, e.target.value)
                    }
                    className="border rounded w-full p-2"
                    rows="3"
                    placeholder="Add teacher feedback"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Marks: {assignment.marks || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Completion: {assignment.computedProgress}%
                    </p>
                    <div className="w-full bg-white rounded-full h-2 mt-2 border border-blue-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(assignment.computedProgress, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {assignment.status === "Pending" && (
                    <button
                      className="mt-3 bg-blue-700 text-white rounded p-2 text-sm"
                      onClick={() => handleMarkSubmitted(index)}
                    >
                      Mark as Submitted
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assignments;
