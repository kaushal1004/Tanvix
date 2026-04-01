import React, { useState } from "react";

const Messaging = ({ messages }) => {
  const [chatMessages, setChatMessages] = useState(messages);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState("Teacher");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { from: "You", message: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">💬 Messaging / Chat</h2>
      <div className="mb-4">
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border p-2"
        >
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.from === "You" ? "text-right" : "text-left"}`}
          >
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 flex-1"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messaging;
