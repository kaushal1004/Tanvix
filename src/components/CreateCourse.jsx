import React, { useState } from "react";
import API from "../services/api";

export default function CreateCourse({ onSuccess }) {
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

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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

  // Field-level validation
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Validate all fields
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await API.post("/courses", form);
      console.log("Response:", res.data);

      setSuccess("✅ Course created successfully!");

      // Reset form
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

      if (onSuccess) onSuccess(res.data);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setFieldErrors({
        submit: err.response?.data?.message || "❌ Failed to create course",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
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
    setSuccess("");
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-xl text-purple-700">📚 Create Course</h3>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Submit Error */}
      {fieldErrors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {fieldErrors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Course Identification */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            🎯 Course Identification
          </h4>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code (e.g., CS101) *
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="CS101"
                className={`border p-2 w-full rounded transition uppercase ${
                  fieldErrors.code
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.code && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.code}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.category
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.category}
                </p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.title
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {form.title.length}/100 characters
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits (1-6) *
              </label>
              <input
                type="number"
                name="credits"
                value={form.credits}
                onChange={handleChange}
                min="1"
                max="6"
                placeholder="3"
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.credits
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.credits && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.credits}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (weeks) *
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min="1"
                max="52"
                placeholder="16"
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.duration
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.duration && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.duration}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Description & Content */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            📖 Course Content
          </h4>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed course description..."
              rows="4"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.description}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {form.description.length}/1000 characters
            </p>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prerequisites
            </label>
            <input
              type="text"
              name="prerequisites"
              value={form.prerequisites}
              onChange={handleChange}
              placeholder="e.g., CS101, Math101"
              className="border border-gray-300 p-2 w-full rounded"
            />
            <p className="text-gray-500 text-xs mt-1">
              Comma-separated list of required courses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., programming, web, database"
              className="border border-gray-300 p-2 w-full rounded"
            />
            <p className="text-gray-500 text-xs mt-1">
              Comma-separated tags for easy searching
            </p>
          </div>
        </div>

        {/* Section 3: Instructor Information */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            👨‍🏫 Instructor Information
          </h4>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor Name *
            </label>
            <input
              type="text"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.instructor
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.instructor && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.instructor}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor Email *
            </label>
            <input
              type="email"
              name="instructorEmail"
              value={form.instructorEmail}
              onChange={handleChange}
              placeholder="instructor@example.com"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.instructorEmail
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.instructorEmail && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.instructorEmail}
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Enrollment Settings */}
        <div className="pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            👥 Enrollment Settings
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Students (1-500) *
            </label>
            <input
              type="number"
              name="maxStudents"
              value={form.maxStudents}
              onChange={handleChange}
              min="1"
              max="500"
              placeholder="30"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.maxStudents
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.maxStudents && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.maxStudents}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 rounded text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:scale-95"
            }`}
          >
            {loading ? "Creating..." : "✓ Create Course"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex-1 py-2 rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            ↻ Reset
          </button>
        </div>
      </form>
    </div>
  );
}
