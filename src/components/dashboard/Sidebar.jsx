import React from "react";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    "Profile",
    "Courses",
    "Progress",
    "Assignments",
    "Exams",
    "Attendance",
    "Notifications",
    "Messaging",
    "Fees",
    "Settings",
  ];

  return (
    <div className="w-64 bg-blue-900 text-blue-100 h-full p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-200">Dashboard Menu</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section}>
            <button
              onClick={() => setActiveSection(section)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                activeSection === section
                  ? "bg-blue-700 text-white shadow-md"
                  : "hover:bg-blue-800 text-blue-200"
              }`}
            >
              {section}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
