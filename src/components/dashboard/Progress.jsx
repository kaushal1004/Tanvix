import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Progress = ({ progress }) => {
  const chartData = progress.weeklyActivity.map((hours, index) => ({
    week: `Week ${index + 1}`,
    hours,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">📊 Progress Tracking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Overall Progress:</strong> {progress.overallProgress}%
          </p>
          <p>
            <strong>Completed Lessons:</strong> {progress.completedLessons}
          </p>
          <p>
            <strong>Pending Lessons:</strong> {progress.pendingLessons}
          </p>
          <p>
            <strong>Time Spent:</strong> {progress.timeSpent}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Weekly Activity (Hours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Progress;
