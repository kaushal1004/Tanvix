import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Validation
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleDayChange = (day) => {
    setForm({
      ...form,
      days: form.days.includes(day)
        ? form.days.filter((d) => d !== day)
        : [...form.days, day],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingId) {
        await API.put(`/classes/${editingId}`, form);
        setSuccess("✅ Class updated successfully!");
      } else {
        await API.post("/classes", form);
        setSuccess("✅ Class created successfully!");
      }

      resetForm();
      setShowForm(false);
      fetchClasses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setFieldErrors({
        submit: err.response?.data?.message || "Failed to save class",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classItem) => {
    setForm(classItem);
    setEditingId(classItem._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await API.delete(`/classes/${id}`);
        setSuccess("✅ Class deleted successfully!");
        fetchClasses();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to delete class");
      }
    }
  };

  const resetForm = () => {
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
    setEditingId(null);
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
        <h2 className="text-2xl font-bold">📚 All Classes</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? "Cancel" : "➕ Add New Class"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? "Edit Class" : "Create New Class"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter class name"
                className={`w-full border p-2 rounded ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Instructor *
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
                Instructor Email
              </label>
              <input
                type="email"
                name="instructorEmail"
                value={form.instructorEmail}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full border p-2 rounded ${fieldErrors.instructorEmail ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.instructorEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.instructorEmail}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                className={`w-full border p-2 rounded ${fieldErrors.capacity ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.capacity && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.capacity}
                </p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${fieldErrors.time ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.time && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.time}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${fieldErrors.endTime ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.endTime}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${fieldErrors.startDate ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.startDate}
                </p>
              )}
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium mb-1">Room *</label>
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="Enter room number"
                className={`w-full border p-2 rounded ${fieldErrors.room ? "border-red-500" : "border-gray-300"}`}
              />
              {fieldErrors.room && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.room}</p>
              )}
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

            {/* Days */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Days of Week *
              </label>
              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.days.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="w-4 h-4"
                    />
                    {day}
                  </label>
                ))}
              </div>
              {fieldErrors.days && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.days}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter class description"
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
                  : editingId
                    ? "Update Class"
                    : "Create Class"}
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

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            <p className="text-3xl mb-2">📚</p>
            <p>No classes found. Create your first class!</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white p-4 shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold mb-2">{classItem.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                👨‍🏫 {classItem.instructor}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📍 Room: {classItem.room}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                ⏰ {classItem.time} - {classItem.endTime}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                📅 {classItem.days?.join(", ")}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                👥 Capacity: {classItem.capacity}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(classItem)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex-1"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex-1"
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
