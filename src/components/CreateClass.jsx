import React, { useState } from "react";
import API from "../services/api";

export default function CreateClass({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    instructor: "",
    instructorEmail: "",
    capacity: "",
    maxCapacity: 100,
    days: [],
    time: "",
    endTime: "",
    startDate: "",
    room: "",
    credits: "",
    level: "intermediate",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Field-level validation
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    delete errors[name];

    switch (name) {
      case "name":
        if (!value.trim()) errors.name = "Class name is required";
        else if (value.length < 3)
          errors.name = "Name must be at least 3 characters";
        else if (value.length > 50)
          errors.name = "Name must be under 50 characters";
        break;
      case "description":
        if (value.length > 500)
          errors.description = "Description must be under 500 characters";
        break;
      case "instructor":
        if (!value.trim()) errors.instructor = "Instructor name is required";
        else if (value.length < 3)
          errors.instructor = "Instructor name must be at least 3 characters";
        break;
      case "instructorEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value))
          errors.instructorEmail = "Invalid email format";
        break;
      case "capacity":
        if (!value) errors.capacity = "Capacity is required";
        else if (value < 1) errors.capacity = "Capacity must be at least 1";
        else if (value > form.maxCapacity)
          errors.capacity = `Capacity cannot exceed ${form.maxCapacity}`;
        break;
      case "time":
        if (!value) errors.time = "Start time is required";
        else if (form.endTime && value >= form.endTime)
          errors.time = "Start time must be before end time";
        break;
      case "endTime":
        if (!value) errors.endTime = "End time is required";
        else if (form.time && value <= form.time)
          errors.endTime = "End time must be after start time";
        break;
      case "startDate":
        if (!value) errors.startDate = "Start date is required";
        else if (new Date(value) < new Date())
          errors.startDate = "Start date cannot be in the past";
        break;
      case "room":
        if (!value.trim()) errors.room = "Room number is required";
        break;
      case "credits":
        if (!value) errors.credits = "Credits are required";
        else if (value < 1 || value > 6)
          errors.credits = "Credits must be between 1 and 6";
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

  // Handle day checkbox change
  const handleDayChange = (day) => {
    setForm({
      ...form,
      days: form.days.includes(day)
        ? form.days.filter((d) => d !== day)
        : [...form.days, day],
    });
    if (form.days.length === 0) validateField("days", [day]);
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Class name is required";
    if (!form.instructor.trim())
      errors.instructor = "Instructor name is required";
    if (!form.capacity) errors.capacity = "Capacity is required";
    if (form.days.length === 0) errors.days = "Select at least one day";
    if (!form.time) errors.time = "Start time is required";
    if (!form.endTime) errors.endTime = "End time is required";
    if (!form.startDate) errors.startDate = "Start date is required";
    if (!form.room.trim()) errors.room = "Room number is required";
    if (!form.credits) errors.credits = "Credits are required";
    if (
      form.instructorEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.instructorEmail)
    ) {
      errors.instructorEmail = "Invalid email format";
    }
    if (form.time && form.endTime && form.time >= form.endTime) {
      errors.time = "Start time must be before end time";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await API.post("/classes", form);
      console.log("Response:", res.data);

      setSuccess("✅ Class created successfully!");

      // Reset form
      setForm({
        name: "",
        description: "",
        instructor: "",
        instructorEmail: "",
        capacity: "",
        maxCapacity: 100,
        days: [],
        time: "",
        endTime: "",
        startDate: "",
        room: "",
        credits: "",
        level: "intermediate",
      });
      setFieldErrors({});

      if (onSuccess) onSuccess(res.data);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setFieldErrors({
        submit: err.response?.data?.message || "❌ Failed to create class",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    setForm({
      name: "",
      description: "",
      instructor: "",
      instructorEmail: "",
      capacity: "",
      maxCapacity: 100,
      days: [],
      time: "",
      endTime: "",
      startDate: "",
      room: "",
      credits: "",
      level: "intermediate",
    });
    setFieldErrors({});
    setSuccess("");
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-xl text-blue-700">🎓 Create Class</h3>
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
        {/* Section 1: Basic Info */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            📋 Basic Information
          </h4>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter class name"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {form.name.length}/50 characters
            </p>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter class description"
              rows="3"
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
              {form.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                placeholder="1-6"
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
          </div>
        </div>

        {/* Section 2: Instructor Info */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            👨‍🏫 Instructor Information
          </h4>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor Name *
            </label>
            <input
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
              Instructor Email
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

        {/* Section 3: Schedule */}
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            📅 Schedule & Room
          </h4>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days of Week *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="mr-2"
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
            {fieldErrors.days && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.days}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.time
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.time && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.time}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.endTime
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.endTime && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.startDate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="e.g., A101"
                className={`border p-2 w-full rounded transition ${
                  fieldErrors.room
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.room && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.room}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Capacity */}
        <div className="pb-4">
          <h4 className="font-semibold text-gray-700 mb-3">👥 Capacity</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (1-{form.maxCapacity}) *
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min="1"
              max={form.maxCapacity}
              placeholder="Enter class capacity"
              className={`border p-2 w-full rounded transition ${
                fieldErrors.capacity
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.capacity && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.capacity}
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
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Creating..." : "✓ Create Class"}
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
