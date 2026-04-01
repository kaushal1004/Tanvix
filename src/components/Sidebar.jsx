import React from "react";

export default function Sidebar({ active, setActive }) {
  const menu = [
    { key: "dashboard", name: "Dashboard", icon: "📊" },
    { key: "users", name: "Students", icon: "👥" },
    { key: "classes", name: "Classes", icon: "🏫" },
    { key: "courses", name: "Courses", icon: "📚" },
    { key: "attendance", name: "Attendance", icon: "✅" },
    { key: "assessment", name: "Student Assessment", icon: "📝" },
    { key: "chat", name: "Messages", icon: "💬" },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">Teacher Panel</h2>

      {menu.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`w-full text-left p-3 mb-2 rounded transition-all flex items-center gap-2 ${
            active === item.key ? "bg-blue-700 shadow-lg" : "hover:bg-blue-800"
          }`}
        >
          <span>{item.icon}</span> {item.name}
        </button>
      ))}
    </div>
  );
}
