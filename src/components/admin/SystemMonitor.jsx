import React from "react";

// Reusable metric display component
const MetricCard = ({ label, value, unit = "", color = "blue" }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <span className="text-gray-700 dark:text-gray-300">{label}</span>
    <span
      className={`text-lg font-bold text-${color}-600 dark:text-${color}-400`}
    >
      {value}
      {unit && <span className="text-sm ml-1">{unit}</span>}
    </span>
  </div>
);

const SystemMonitor = ({ adminStats }) => {
  // Calculate statistics
  const studentTeacherRatio = (
    adminStats.totalStudents / adminStats.totalTeachers
  ).toFixed(1);
  const usageRate = (
    (adminStats.activeUsers / adminStats.totalStudents) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          System Overview
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Key system metrics and statistics
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Students"
          value={adminStats.totalStudents}
          color="blue"
        />
        <MetricCard
          label="Total Teachers"
          value={adminStats.totalTeachers}
          color="green"
        />
        <MetricCard
          label="Active Courses"
          value={adminStats.totalCourses}
          color="purple"
        />
        <MetricCard
          label="Total Classes"
          value={adminStats.totalClasses}
          color="orange"
        />
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Status */}
        <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-sm text-green-700 dark:text-green-300 font-semibold">
            System Health
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {adminStats.systemHealth}
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
            Active Users
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {adminStats.activeUsers}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            {usageRate}% usage rate
          </div>
        </div>

        {/* Student-Teacher Ratio */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
            Student:Teacher Ratio
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {studentTeacherRatio}:1
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
            System Information
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Status:</span> Online
            </div>
            <div>
              <span className="font-medium">Database:</span> Connected
            </div>
            <div>
              <span className="font-medium">Last Sync:</span> Just now
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
            Recommendations
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>All systems operating normally</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✓</span>
              <span>Student engagement is healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
