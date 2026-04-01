import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    subject: "",
    experience: "",
    qualification: "",
    classes: "",
    address: "",
    linkedin: "",
    github: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image upload (basic preview)
  const handleImage = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, avatar: URL.createObjectURL(file) });
  };

  // Save profile
  const handleSave = async () => {
    try {
      setLoading(true);
      await API.post("/profile", profile);
      alert("Profile Updated");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Teacher Profile</h2>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Name */}
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded"
        />

        {/* Email */}
        <input
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />

        {/* Phone */}
        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded"
        />

        {/* Subject */}
        <input
          name="subject"
          value={profile.subject}
          onChange={handleChange}
          placeholder="Subject Specialization"
          className="border p-2 rounded"
        />

        {/* Experience */}
        <input
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          placeholder="Experience (years)"
          className="border p-2 rounded"
        />

        {/* Qualification */}
        <input
          name="qualification"
          value={profile.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          className="border p-2 rounded"
        />

        {/* Classes */}
        <input
          name="classes"
          value={profile.classes}
          onChange={handleChange}
          placeholder="Classes Assigned"
          className="border p-2 rounded"
        />

        {/* Address */}
        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded"
        />

        {/* LinkedIn */}
        <input
          name="linkedin"
          value={profile.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="border p-2 rounded"
        />

        {/* GitHub */}
        <input
          name="github"
          value={profile.github}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="border p-2 rounded"
        />
      </div>

      {/* Bio */}
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        placeholder="Short Bio"
        className="border p-2 rounded w-full mt-4"
      />

      {/* Profile Image */}
      <div className="mt-4">
        <label className="block mb-2 font-medium">Profile Image</label>
        <input type="file" onChange={handleImage} />
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="preview"
            className="mt-3 w-24 h-24 rounded-full object-cover"
          />
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}