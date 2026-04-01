import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Users from "./components/Students";
import Classes from "./components/Classes";
import Courses from "./components/Courses";
import Attendance from "./components/Attendance";
import StudentAssessment from "./components/StudentAssessment";
import Chat from "./components/Chat";
import Profile from "./components/Profile";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const renderContent = () => {
    switch (active) {
      case "users":
        return <Users />;
      case "classes":
        return <Classes />;
      case "courses":
        return <Courses />;
      case "attendance":
        return <Attendance />;
      case "assessment":
        return <StudentAssessment />;
      case "chat":
        return <Chat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black text-black dark:text-white transition-all duration-300">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-black">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
