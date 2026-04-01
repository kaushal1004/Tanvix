import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";
import BlankPage from "./BlankPage";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import Profile from "./components/Profile";
import StudentDashboard from "./components/StudentDashboard";
import AdminPanel from "./components/admin/AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Router>
        <Routes>
          <Route path="/" element={<ApplicationForm />} />
          <Route path="/blank" element={<BlankPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
