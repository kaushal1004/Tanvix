import React, { useState } from "react";

const Profile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [preview, setPreview] = useState(profile.profilePhoto);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview image
      setFormData({ ...formData, profilePhoto: file }); // store file
    }
  };

  const handleSave = () => {
    // 👉 API call here (multipart/form-data)
    console.log("Updated Data:", formData);

    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">👤 Profile Section</h2>

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            <label className="mt-3 cursor-pointer bg-blue-500 text-white px-3 py-1 rounded">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="text-sm">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Course</label>
              <input
                name="courseEnrolled"
                value={formData.courseEnrolled}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Registration Date</label>
              <input
                name="registrationDate"
                type="date"
                value={formData.registrationDate}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <label className="text-sm">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-6 mb-6">
            <img
              src={profile.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            <div>
              <h3 className="text-xl font-semibold">{profile.fullName}</h3>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-500">{profile.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>DOB:</strong> {profile.dateOfBirth}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Course:</strong> {profile.courseEnrolled}</p>
            <p><strong>Joined:</strong> {profile.registrationDate}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p>
              <strong>Social:</strong>{" "}
              {profile.socialLinks?.linkedin || "N/A"} |{" "}
              {profile.socialLinks?.github || "N/A"}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;