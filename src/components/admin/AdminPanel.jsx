import React, { useState } from "react";
import AdminDashboard from "../../AdminDashboard";
import StudentDashboard from "../StudentDashboard";
import TeacherPanel from "./TeacherPanel";
import StudentPanel from "./StudentPanel";
import ControlPanel from "./ControlPanel";
import Modal from "./Modal";

const AdminPanel = () => {
  const [activePanel, setActivePanel] = useState("admin");
  const [showModal, setShowModal] = useState(null);

  // Admin Stats
  const [adminStats, setAdminStats] = useState({
    totalTeachers: 45,
    totalStudents: 1200,
    totalCourses: 30,
    totalClasses: 75,
    activeUsers: 892,
    systemHealth: "Excellent",
  });

  // Teacher Management State
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Smith",
      email: "smith@school.com",
      courses: 3,
      status: "Active",
      department: "Computer Science",
      experience: "8 years",
      qualifications: "PhD in Computer Science",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Prof. Johnson",
      email: "johnson@school.com",
      courses: 2,
      status: "Active",
      department: "Mathematics",
      experience: "12 years",
      qualifications: "PhD in Mathematics",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Ms. Williams",
      email: "williams@school.com",
      courses: 4,
      status: "Inactive",
      department: "English Literature",
      experience: "6 years",
      qualifications: "MA in English",
      rating: 4.6,
    },
  ]);

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Programming 101",
      instructor: "Dr. Smith",
      students: 45,
      status: "Active",
      department: "Computer Science",
      credits: 3,
      duration: "12 weeks",
    },
    {
      id: 2,
      title: "Data Structures",
      instructor: "Prof. Johnson",
      students: 38,
      status: "Active",
      department: "Computer Science",
      credits: 4,
      duration: "10 weeks",
    },
    {
      id: 3,
      title: "Web Development",
      instructor: "Dr. Smith",
      students: 52,
      status: "Active",
      department: "Computer Science",
      credits: 3,
      duration: "14 weeks",
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@student.com",
      enrolledCourses: 3,
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@student.com",
      enrolledCourses: 2,
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@student.com",
      enrolledCourses: 4,
      status: "Inactive",
    },
  ]);

  const [assignments] = useState([
    {
      id: 1,
      title: "Assignment 1",
      course: "Programming 101",
      dueDate: "2026-04-15",
      submissions: 38,
      status: "Active",
    },
    {
      id: 2,
      title: "Assignment 2",
      course: "Data Structures",
      dueDate: "2026-04-20",
      submissions: 25,
      status: "Active",
    },
  ]);

  // Advanced Feature Control State
  const [featureControl, setFeatureControl] = useState({
    // Core System Features
    teacherPanel: {
      enabled: true,
      category: "core",
      description: "Teacher dashboard and management interface",
      impact: "high",
      dependencies: [],
    },
    studentPanel: {
      enabled: true,
      category: "core",
      description: "Student dashboard and learning interface",
      impact: "high",
      dependencies: [],
    },
    userManagement: {
      enabled: true,
      category: "core",
      description: "User account creation and management",
      impact: "critical",
      dependencies: [],
    },

    // Academic Features
    attendance: {
      enabled: true,
      category: "academic",
      description: "Attendance tracking and reporting",
      impact: "medium",
      dependencies: ["userManagement"],
    },
    assessments: {
      enabled: true,
      category: "academic",
      description: "Assignment and exam management",
      impact: "high",
      dependencies: ["userManagement"],
    },
    courseMaterial: {
      enabled: true,
      category: "academic",
      description: "Course content and material access",
      impact: "high",
      dependencies: ["userManagement"],
    },
    grading: {
      enabled: true,
      category: "academic",
      description: "Automated grading and feedback system",
      impact: "medium",
      dependencies: ["assessments"],
    },

    // Communication Features
    messaging: {
      enabled: true,
      category: "communication",
      description: "Internal messaging and notifications",
      impact: "medium",
      dependencies: [],
    },
    announcements: {
      enabled: true,
      category: "communication",
      description: "System-wide announcements",
      impact: "low",
      dependencies: [],
    },
    emailIntegration: {
      enabled: false,
      category: "communication",
      description: "Email notifications and integration",
      impact: "medium",
      dependencies: ["messaging"],
    },

    // Analytics & Reporting
    analyticsEnabled: {
      enabled: true,
      category: "analytics",
      description: "Usage analytics and insights",
      impact: "low",
      dependencies: [],
    },
    reportingEnabled: {
      enabled: true,
      category: "analytics",
      description: "Advanced reporting and dashboards",
      impact: "medium",
      dependencies: ["analyticsEnabled"],
    },
    auditLogsEnabled: {
      enabled: true,
      category: "analytics",
      description: "System audit logging",
      impact: "medium",
      dependencies: [],
    },

    // Advanced Features
    aiAssistant: {
      enabled: false,
      category: "advanced",
      description: "AI-powered learning assistant",
      impact: "medium",
      dependencies: ["userManagement"],
    },
    collaborationTools: {
      enabled: false,
      category: "advanced",
      description: "Group collaboration features",
      impact: "low",
      dependencies: ["messaging"],
    },
    mobileApp: {
      enabled: false,
      category: "advanced",
      description: "Mobile application access",
      impact: "low",
      dependencies: [],
    },
  });

  // Feature Categories
  const featureCategories = {
    core: { name: "Core System", color: "red", icon: "⚙️" },
    academic: { name: "Academic", color: "blue", icon: "📚" },
    communication: { name: "Communication", color: "green", icon: "💬" },
    analytics: { name: "Analytics", color: "purple", icon: "📊" },
    advanced: { name: "Advanced", color: "orange", icon: "🚀" },
  };

  // Form Data for Modal
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "teacher",
  });

  const handlePanelSwitch = (panel) => {
    setActivePanel(panel);
  };

  // Modal Handlers
  const openModal = (modalType) => {
    setShowModal(modalType);
    setFormData({ name: "", email: "", role: "teacher" });
  };

  const closeModal = () => {
    setShowModal(null);
    setFormData({ name: "", email: "", role: "teacher" });
  };

  // Add new teacher/student
  const handleAddUser = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        courses: 0,
        enrolledCourses: 0,
        status: "Active",
        department: formData.department || "General",
        experience: formData.experience || "0 years",
        qualifications: formData.qualifications || "Not specified",
        rating: 0,
      };

      if (formData.role === "teacher") {
        setTeachers([...teachers, newUser]);
        setAdminStats({
          ...adminStats,
          totalTeachers: adminStats.totalTeachers + 1,
        });
      } else {
        setStudents([...students, newUser]);
        setAdminStats({
          ...adminStats,
          totalStudents: adminStats.totalStudents + 1,
        });
      }
      closeModal();
    }
  };

  // Add new course
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (formData.name && formData.role) {
      const newCourse = {
        id: Date.now(),
        title: formData.name,
        instructor: formData.role,
        students: 0,
        status: "Active",
        department: formData.department || "General",
        credits: formData.credits || 3,
        duration: formData.duration || "12 weeks",
      };
      setCourses([...courses, newCourse]);
      setAdminStats({
        ...adminStats,
        totalCourses: adminStats.totalCourses + 1,
      });
      closeModal();
    }
  };

  // Toggle user status
  const toggleUserStatus = (userId, type) => {
    if (type === "teacher") {
      setTeachers(
        teachers.map((t) =>
          t.id === userId
            ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
            : t,
        ),
      );
    } else {
      setStudents(
        students.map((s) =>
          s.id === userId
            ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
            : s,
        ),
      );
    }
  };

  // Delete user
  const deleteUser = (userId, type) => {
    if (type === "teacher") {
      setTeachers(teachers.filter((t) => t.id !== userId));
      setAdminStats({
        ...adminStats,
        totalTeachers: adminStats.totalTeachers - 1,
      });
    } else {
      setStudents(students.filter((s) => s.id !== userId));
      setAdminStats({
        ...adminStats,
        totalStudents: adminStats.totalStudents - 1,
      });
    }
  };

  // Delete course
  const deleteCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    setAdminStats({ ...adminStats, totalCourses: adminStats.totalCourses - 1 });
  };

  // Promote student to teacher
  const promoteStudentToTeacher = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // Create teacher object from student
    const newTeacher = {
      ...student,
      courses: 0,
      department: "General",
      experience: "0 years",
      qualifications: "In Progress",
      rating: 0,
      enrolledCourses: undefined,
    };

    // Add to teachers
    setTeachers([...teachers, newTeacher]);

    // Remove from students
    setStudents(students.filter((s) => s.id !== studentId));

    // Update stats
    setAdminStats({
      ...adminStats,
      totalStudents: adminStats.totalStudents - 1,
      totalTeachers: adminStats.totalTeachers + 1,
    });
  };

  // Advanced Feature Control Functions
  const toggleFeature = (featureKey) => {
    const feature = featureControl[featureKey];
    const newEnabled = !feature.enabled;

    // Check dependencies when enabling
    if (newEnabled && feature.dependencies.length > 0) {
      const unmetDeps = feature.dependencies.filter(
        (dep) => !featureControl[dep].enabled,
      );
      if (unmetDeps.length > 0) {
        alert(
          `Cannot enable ${featureKey.replace(/([A-Z])/g, " $1").toUpperCase()}. Required dependencies: ${unmetDeps.join(", ")}`,
        );
        return;
      }
    }

    // Check dependent features when disabling
    if (!newEnabled) {
      const dependentFeatures = Object.keys(featureControl).filter((key) =>
        featureControl[key].dependencies.includes(featureKey),
      );
      if (dependentFeatures.length > 0) {
        const confirmed = window.confirm(
          `Disabling ${featureKey.replace(/([A-Z])/g, " $1").toUpperCase()} will also disable: ${dependentFeatures.join(", ")}. Continue?`,
        );
        if (!confirmed) return;

        // Disable dependent features
        setFeatureControl((prev) => {
          const updated = { ...prev };
          dependentFeatures.forEach((dep) => {
            updated[dep] = { ...updated[dep], enabled: false };
          });
          updated[featureKey] = { ...updated[featureKey], enabled: newEnabled };
          return updated;
        });
        return;
      }
    }

    setFeatureControl((prev) => ({
      ...prev,
      [featureKey]: { ...prev[featureKey], enabled: newEnabled },
    }));
  };

  const toggleCategory = (category) => {
    const categoryFeatures = Object.keys(featureControl).filter(
      (key) => featureControl[key].category === category,
    );

    const allEnabled = categoryFeatures.every(
      (key) => featureControl[key].enabled,
    );
    const newState = !allEnabled;

    // Check dependencies for enabling
    if (newState) {
      for (const featureKey of categoryFeatures) {
        const feature = featureControl[featureKey];
        if (feature.dependencies.length > 0) {
          const unmetDeps = feature.dependencies.filter(
            (dep) => !featureControl[dep].enabled,
          );
          if (unmetDeps.length > 0) {
            alert(
              `Cannot enable ${category} features. ${featureKey} requires: ${unmetDeps.join(", ")}`,
            );
            return;
          }
        }
      }
    }

    setFeatureControl((prev) => {
      const updated = { ...prev };
      categoryFeatures.forEach((key) => {
        updated[key] = { ...updated[key], enabled: newState };
      });
      return updated;
    });
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset all features to default settings?")) {
      setFeatureControl({
        teacherPanel: {
          enabled: true,
          category: "core",
          description: "Teacher dashboard and management interface",
          impact: "high",
          dependencies: [],
        },
        studentPanel: {
          enabled: true,
          category: "core",
          description: "Student dashboard and learning interface",
          impact: "high",
          dependencies: [],
        },
        userManagement: {
          enabled: true,
          category: "core",
          description: "User account creation and management",
          impact: "critical",
          dependencies: [],
        },
        attendance: {
          enabled: true,
          category: "academic",
          description: "Attendance tracking and reporting",
          impact: "medium",
          dependencies: ["userManagement"],
        },
        assessments: {
          enabled: true,
          category: "academic",
          description: "Assignment and exam management",
          impact: "high",
          dependencies: ["userManagement"],
        },
        courseMaterial: {
          enabled: true,
          category: "academic",
          description: "Course content and material access",
          impact: "high",
          dependencies: ["userManagement"],
        },
        grading: {
          enabled: true,
          category: "academic",
          description: "Automated grading and feedback system",
          impact: "medium",
          dependencies: ["assessments"],
        },
        messaging: {
          enabled: true,
          category: "communication",
          description: "Internal messaging and notifications",
          impact: "medium",
          dependencies: [],
        },
        announcements: {
          enabled: true,
          category: "communication",
          description: "System-wide announcements",
          impact: "low",
          dependencies: [],
        },
        emailIntegration: {
          enabled: false,
          category: "communication",
          description: "Email notifications and integration",
          impact: "medium",
          dependencies: ["messaging"],
        },
        analyticsEnabled: {
          enabled: true,
          category: "analytics",
          description: "Usage analytics and insights",
          impact: "low",
          dependencies: [],
        },
        reportingEnabled: {
          enabled: true,
          category: "analytics",
          description: "Advanced reporting and dashboards",
          impact: "medium",
          dependencies: ["analyticsEnabled"],
        },
        auditLogsEnabled: {
          enabled: true,
          category: "analytics",
          description: "System audit logging",
          impact: "medium",
          dependencies: [],
        },
        aiAssistant: {
          enabled: false,
          category: "advanced",
          description: "AI-powered learning assistant",
          impact: "medium",
          dependencies: ["userManagement"],
        },
        collaborationTools: {
          enabled: false,
          category: "advanced",
          description: "Group collaboration features",
          impact: "low",
          dependencies: ["messaging"],
        },
        mobileApp: {
          enabled: false,
          category: "advanced",
          description: "Mobile application access",
          impact: "low",
          dependencies: [],
        },
      });
    }
  };

  const exportFeatureConfig = () => {
    const config = {
      timestamp: new Date().toISOString(),
      features: featureControl,
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFeatureConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          if (config.features) {
            setFeatureControl(config.features);
            alert("Feature configuration imported successfully!");
          }
        } catch (error) {
          alert("Invalid configuration file!");
        }
      };
      reader.readAsText(file);
    }
  };

  // Render Control Panel
  const renderPanelContent = () => {
    switch (activePanel) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return (
          <TeacherPanel
            adminStats={adminStats}
            teachers={teachers}
            courses={courses}
            onOpenModal={openModal}
            onToggleUserStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
            onDeleteCourse={deleteCourse}
          />
        );
      case "student":
        return (
          <StudentPanel
            adminStats={adminStats}
            students={students}
            assignments={assignments}
            onOpenModal={openModal}
            onToggleUserStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
            onPromoteToTeacher={promoteStudentToTeacher}
          />
        );
      case "control":
        return (
          <ControlPanel
            adminStats={adminStats}
            featureControl={featureControl}
            featureCategories={featureCategories}
            onToggleFeature={toggleFeature}
            onToggleCategory={toggleCategory}
            onResetToDefaults={resetToDefaults}
            onExportConfig={exportFeatureConfig}
            onImportConfig={importFeatureConfig}
          />
        );
      default:
        return <AdminDashboard />;
    }
  };

  // Modal Component
  // Modal Component
  const renderModal = () => {
    if (!showModal) return null;

    const isTeacher = showModal === "addTeacher";
    const isStudent = showModal === "addStudent";
    const isCourse = showModal === "addCourse";
    const isEditTeacher = showModal === "editTeacher";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {isTeacher
                ? "Add Teacher"
                : isStudent
                  ? "Add Student"
                  : isCourse
                    ? "Add Course"
                    : "Edit Teacher"}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={isCourse ? handleAddCourse : handleAddUser}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {isCourse ? "Course Title" : "Name"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {isCourse ? "Instructor" : "Email"}
              </label>
              <input
                type={isCourse ? "text" : "email"}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {(isTeacher || isStudent) && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Literature">
                      English Literature
                    </option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                {isTeacher && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        value={formData.qualifications || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualifications: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., PhD in Computer Science"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={formData.experience || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 8 years"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {isCourse && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Literature">
                      English Literature
                    </option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Credits
                  </label>
                  <input
                    type="number"
                    value={formData.credits || 3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="6"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12 weeks"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                {isEditTeacher ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      {/* Master Control Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-black shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚙️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Master Admin Panel
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              System Health:{" "}
              <span className="text-green-400 font-semibold">
                {adminStats.systemHealth}
              </span>
            </div>
          </div>

          {/* Panel Navigation Tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handlePanelSwitch("admin")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activePanel === "admin"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              📊 Admin Dashboard
            </button>
            <button
              onClick={() => handlePanelSwitch("teacher")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activePanel === "teacher"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              👨‍🏫 Teacher Management
            </button>
            <button
              onClick={() => handlePanelSwitch("student")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activePanel === "student"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              👨‍🎓 Student Management
            </button>
            <button
              onClick={() => handlePanelSwitch("control")}
              className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                activePanel === "control"
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              🔧 System Control
            </button>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Teachers:{" "}
                <span className="font-semibold">
                  {adminStats.totalTeachers}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Students:{" "}
                <span className="font-semibold">
                  {adminStats.totalStudents}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Courses:{" "}
                <span className="font-semibold">{adminStats.totalCourses}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Classes:{" "}
                <span className="font-semibold">{adminStats.totalClasses}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className="max-w-7xl mx-auto p-6">{renderPanelContent()}</div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 text-center py-4 mt-8">
        <p className="text-sm">
          © 2026 Master Admin Panel | All Rights Reserved | System Version 1.0
        </p>
      </footer>

      {/* Modal */}
      <Modal
        showModal={showModal}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSubmitUser={handleAddUser}
        onSubmitCourse={handleAddCourse}
      />
    </div>
  );
};

export default AdminPanel;
