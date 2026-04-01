import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Attendance = ({ attendance }) => {
  const data = [
    { name: "Present", value: attendance.present, color: "#10B981" },
    { name: "Absent", value: attendance.absent, color: "#EF4444" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">📅 Attendance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Total Classes:</strong> {attendance.totalClasses}
          </p>
          <p>
            <strong>Present:</strong> {attendance.present}
          </p>
          <p>
            <strong>Absent:</strong> {attendance.absent}
          </p>
          <p>
            <strong>Attendance %:</strong> {attendance.percentage}%
          </p>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
