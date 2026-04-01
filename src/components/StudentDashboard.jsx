import React, { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Profile from "./dashboard/Profile";
import Courses from "./dashboard/Courses";
import Progress from "./dashboard/Progress";
import Assignments from "./dashboard/Assignments";
import Exams from "./dashboard/Exams";
import Attendance from "./dashboard/Attendance";
import Notifications from "./dashboard/Notifications";
import Messaging from "./dashboard/Messaging";
import Fees from "./dashboard/Fees";
import Settings from "./dashboard/Settings";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("Profile");

  // Static student data for demonstration
  const student = {
    profile: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      profilePhoto: "/placeholder-avatar.jpg",
      dateOfBirth: "1995-01-01",
      address: "123 Main St, City, State",
      courseEnrolled: "Computer Science",
      registrationDate: "2023-09-01",
      bio: "A dedicated student passionate about learning.",
      socialLinks: { linkedin: "", github: "" },
    },
    courses: [
      {
        title: "Introduction to Programming",
        code: "CS101",
        instructor: "Dr. Smith",
        duration: "12 weeks",
        progress: 75,
        status: "Active",
        startDate: "2023-09-01",
        endDate: "2023-11-30",
      },
      {
        title: "Data Structures",
        code: "CS201",
        instructor: "Prof. Johnson",
        duration: "10 weeks",
        progress: 50,
        status: "Active",
        startDate: "2023-10-01",
        endDate: "2023-12-15",
      },
    ],
    progress: {
      overallProgress: 62,
      completedLessons: 45,
      pendingLessons: 30,
      timeSpent: "120 hours",
      weeklyActivity: [10, 15, 8, 12, 20, 18, 14], // hours per week
    },
    assignments: [
      {
        title: "Assignment 1",
        subject: "Programming",
        submissionDate: "2023-10-15",
        status: "Submitted",
        marks: "85/100",
        feedback: "Good work!",
      },
      {
        title: "Assignment 2",
        subject: "Data Structures",
        submissionDate: "2023-11-01",
        status: "Pending",
        marks: "",
        feedback: "",
      },
    ],
    exams: [
      {
        name: "Mid-term Exam",
        date: "2023-10-20",
        duration: "2 hours",
        score: "78/100",
        result: "Pass",
        rank: "5th",
      },
      {
        name: "Final Exam",
        date: "2023-12-15",
        duration: "3 hours",
        score: "",
        result: "",
        rank: "",
      },
    ],
    attendance: {
      totalClasses: 100,
      present: 85,
      absent: 15,
      percentage: 85,
    },
    notifications: [
      "New course material uploaded for CS101",
      "Assignment deadline approaching",
      "Exam scheduled for next week",
    ],
    messages: [
      { from: "Teacher", message: "Please review the latest assignment." },
      { from: "Admin", message: "Fee payment reminder." },
    ],
    fees: {
      status: "Paid",
      history: ["Paid $500 on 2023-09-01"],
      invoiceDownload: true,
    },
    settings: {
      changePassword: true,
      updateProfile: true,
      darkMode: false,
      language: "English",
    },
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile profile={student.profile} />;
      case "Courses":
        return <Courses courses={student.courses} />;
      case "Progress":
        return <Progress progress={student.progress} />;
      case "Assignments":
        return <Assignments assignments={student.assignments} />;
      case "Exams":
        return <Exams exams={student.exams} />;
      case "Attendance":
        return <Attendance attendance={student.attendance} />;
      case "Notifications":
        return <Notifications notifications={student.notifications} />;
      case "Messaging":
        return <Messaging messages={student.messages} />;
      case "Fees":
        return <Fees fees={student.fees} />;
      case "Settings":
        return <Settings settings={student.settings} />;
      default:
        return <Profile profile={student.profile} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎓 Student Dashboard
        </h1>
        {renderSection()}
      </div>
    </div>
  );
};

export default StudentDashboard;
