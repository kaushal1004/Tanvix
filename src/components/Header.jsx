import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faUserEdit,
  faMoon,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow relative">
      <h1 className="text-lg font-semibold dark:text-white">
        Teacher Admin Dashboard
      </h1>

      <div className="flex items-center gap-3 relative">
        {/* Profile */}
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer font-medium flex items-center gap-2 dark:text-white"
        >
          <FontAwesomeIcon icon={faUser} />
          Profile
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 z-50">
            
            <div className="border-b pb-2 mb-2 dark:border-gray-500">
              <p className="font-semibold dark:text-white">John Doe</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                john@example.com
              </p>
            </div>

            <ul className="space-y-2 text-sm">
              
              {/* Privacy */}
              <li className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded cursor-pointer flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} />
                Privacy & Security
              </li>

              {/* Update Profile */}
              <li
                onClick={() => navigate("/profile")}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded cursor-pointer flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUserEdit} />
                Update Profile
              </li>

              {/* Dark Mode */}
              <li
                onClick={() => setDarkMode(!darkMode)}
                className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded cursor-pointer flex justify-between items-center"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMoon} />
                  Dark Mode
                </span>
                <span>{darkMode ? "ON" : "OFF"}</span>
              </li>

              {/* Logout */}
              <li
                onClick={handleLogout}
                className="hover:bg-red-100 dark:hover:bg-red-500 p-2 rounded cursor-pointer text-red-500 dark:text-red-300 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </li>

            </ul>
          </div>
        )}
      </div>
    </div>
  );
}