import React, { useState } from "react";

const Settings = ({ settings }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [newPassword, setNewPassword] = useState("");

  const handleToggle = (key) => {
    setCurrentSettings({ ...currentSettings, [key]: !currentSettings[key] });
  };

  const handlePasswordChange = () => {
    // Password change logic
    console.log("Changing password");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">⚙️ Settings</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>
        <div>
          <h3 className="font-semibold">Preferences</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentSettings.darkMode}
              onChange={() => handleToggle("darkMode")}
              className="mr-2"
            />
            Dark Mode
          </label>
          <div className="mt-2">
            <label>Language</label>
            <select
              value={currentSettings.language}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  language: e.target.value,
                })
              }
              className="border p-2 ml-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;
