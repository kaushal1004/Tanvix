import React, { useState } from "react";

const Notifications = ({ notifications }) => {
  const [notifs, setNotifs] = useState(
    notifications.map((n) => ({ text: n, read: false })),
  );

  const markAsRead = (index) => {
    const newNotifs = [...notifs];
    newNotifs[index].read = true;
    setNotifs(newNotifs);
  };

  const deleteNotif = (index) => {
    setNotifs(notifs.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">🔔 Notifications</h2>
      <ul className="space-y-2">
        {notifs.map((notif, index) => (
          <li
            key={index}
            className={`border rounded p-2 flex justify-between items-center ${notif.read ? "bg-gray-100" : "bg-blue-50"}`}
          >
            <span>{notif.text}</span>
            <div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(index)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => deleteNotif(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
