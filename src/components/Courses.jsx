import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    credits: "",
    level: "intermediate",
    category: "",
    instructor: "",
    instructorEmail: "",
    prerequisites: "",
    duration: "",
    maxStudents: "30",
    tags: "",
    syllabus: "",
  });

  const categories = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Arts",
    "History",
    "Languages",
  ];

  const levels = ["beginner", "intermediate", "advanced"];

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Validation
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    delete errors[name];

    switch (name) {
      case "title":
        if (!value.trim()) errors.title = "Course title is required";
        else if (value.length < 3)
          errors.title = "Title must be at least 3 characters";
        else if (value.length > 100)
          errors.title = "Title must be under 100 characters";
        break;
      case "code":
        if (!value.trim()) errors.code = "Course code is required";
        else if (!/^[A-Z]{2,4}\d{3,4}$/.test(value)) {
          errors.code = "Code format: ABC123 (letters + numbers)";
        }
        break;
      case "description":
        if (!value.trim()) errors.description = "Description is required";
        else if (value.length < 20)
          errors.description = "Description must be at least 20 characters";
        else if (value.length > 1000)
          errors.description = "Description must be under 1000 characters";
        break;
      case "credits":
        if (!value) errors.credits = "Credits are required";
        else if (value < 1 || value > 6)
          errors.credits = "Credits must be between 1 and 6";
        break;
      case "category":
        if (!value) errors.category = "Category is required";
        break;
      case "instructor":
        if (!value.trim()) errors.instructor = "Instructor name is required";
        else if (value.length < 3)
          errors.instructor = "Instructor name must be at least 3 characters";
        break;
      case "instructorEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) errors.instructorEmail = "Instructor email is required";
        else if (!emailRegex.test(value))
          errors.instructorEmail = "Invalid email format";
        break;
      case "duration":
        if (!value) errors.duration = "Duration is required";
        else if (value < 1 || value > 52)
          errors.duration = "Duration must be between 1 and 52 weeks";
        break;
      case "maxStudents":
        if (!value) errors.maxStudents = "Max students is required";
        else if (value < 1 || value > 500)
          errors.maxStudents = "Must be between 1 and 500 students";
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    return !errors[name];
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Course title is required";
    if (!form.code.trim()) errors.code = "Course code is required";
    else if (!/^[A-Z]{2,4}\d{3,4}$/.test(form.code))
      errors.code = "Code format: ABC123";
    if (!form.description.trim())
      errors.description = "Description is required";
    if (form.description.length < 20)
      errors.description = "Description must be at least 20 characters";
    if (!form.credits) errors.credits = "Credits are required";
    if (!form.category) errors.category = "Category is required";
    if (!form.instructor.trim())
      errors.instructor = "Instructor name is required";
    if (!form.instructorEmail)
      errors.instructorEmail = "Instructor email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.instructorEmail)) {
      errors.instructorEmail = "Invalid email format";
    }
    if (!form.duration) errors.duration = "Duration is required";
    if (!form.maxStudents) errors.maxStudents = "Max students is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editId) {
        await API.put(`/courses/${editId}`, form);
        setSuccess("✅ Course updated successfully!");
      } else {
        await API.post("/courses", form);
        setSuccess("✅ Course created successfully!");
      }

      resetForm();
      setShowForm(false);
      fetchCourses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setFieldErrors({
        submit: err.response?.data?.message || "Failed to save course",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditId(course._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await API.delete(`/courses/${id}`);
        setSuccess("✅ Course deleted successfully!");
        fetchCourses();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to delete course");
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      code: "",
      credits: "",
      level: "intermediate",
      category: "",
      instructor: "",
      instructorEmail: "",
      prerequisites: "",
      duration: "",
      maxStudents: "30",
      tags: "",
      syllabus: "",
    });
    setFieldErrors({});
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Header and Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📚 Courses Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? "Cancel" : "➕ Add New Course"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4">
            {editId ? "Edit Course" : "Create New Course"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter course title"
                className={`w-full border p-2 rounded ${fieldErrors.title ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.title && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Code *
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="e.g., CS101"
                className={`w-full border p-2 rounded ${fieldErrors.code ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.code && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.code}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${fieldErrors.category ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Credits *
              </label>
              <input
                type="number"
                name="credits"
                value={form.credits}
                onChange={handleChange}
                min="1"
                max="6"
                className={`w-full border p-2 rounded ${fieldErrors.credits ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.credits && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.credits}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (weeks) *
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                className={`w-full border p-2 rounded ${fieldErrors.duration ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.duration && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.duration}
                </p>
              )}
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                placeholder="Enter instructor name"
                className={`w-full border p-2 rounded ${fieldErrors.instructor ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.instructor && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.instructor}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Instructor Email *
              </label>
              <input
                type="email"
                name="instructorEmail"
                value={form.instructorEmail}
                onChange={handleChange}
                placeholder="Enter instructor email"
                className={`w-full border p-2 rounded ${fieldErrors.instructorEmail ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.instructorEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.instructorEmail}
                </p>
              )}
            </div>

            {/* Max Students */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Students *
              </label>
              <input
                type="number"
                name="maxStudents"
                value={form.maxStudents}
                onChange={handleChange}
                placeholder="Enter max students"
                className={`w-full border p-2 rounded ${fieldErrors.maxStudents ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.maxStudents && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.maxStudents}
                </p>
              )}
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Prerequisites
              </label>
              <input
                type="text"
                name="prerequisites"
                value={form.prerequisites}
                onChange={handleChange}
                placeholder="Enter prerequisites"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Enter tags (comma-separated)"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter course description"
                rows="3"
                className={`w-full border p-2 rounded ${fieldErrors.description ? "border-red-500" : "border-gray-300"}`}
              ></textarea>
              {fieldErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Syllabus */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Syllabus</label>
              <textarea
                name="syllabus"
                value={form.syllabus}
                onChange={handleChange}
                placeholder="Enter course syllabus"
                rows="3"
                className="w-full border border-gray-300 p-2 rounded"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold flex-1"
              >
                {loading
                  ? "Saving..."
                  : editId
                    ? "Update Course"
                    : "Create Course"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 font-semibold flex-1"
              >
                Cancel
              </button>
            </div>

            {fieldErrors.submit && (
              <p className="text-red-500 col-span-2">{fieldErrors.submit}</p>
            )}
          </form>
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <p className="text-3xl mb-2">📚</p>
            <p>No courses found. Create your first course!</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-4 shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.code}</p>
              </div>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                {course.description}
              </p>
              <div className="text-sm space-y-1 mb-3">
                <p className="text-gray-600">👨‍🏫 {course.instructor}</p>
                <p className="text-gray-600">📧 {course.instructorEmail}</p>
                <p className="text-gray-600">📂 {course.category}</p>
                <p className="text-gray-600">⭐ Level: {course.level}</p>
                <p className="text-gray-600">⏱️ {course.duration} weeks</p>
                <p className="text-gray-600">
                  👥 Max Students: {course.maxStudents}
                </p>
                <p className="text-gray-600">💳 Credits: {course.credits}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 flex-1"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 flex-1"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
