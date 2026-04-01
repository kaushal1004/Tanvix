import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchConversations();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/users");
      setStudents(res.data.filter((u) => u.role === "student"));
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await API.get("/conversations");
      setConversations(res.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      // Mock data for demo
      setConversations([]);
    }
  };

  const fetchMessages = async (studentId) => {
    try {
      setLoading(true);
      const res = await API.get(`/messages/${studentId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    fetchMessages(student._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const messageData = {
        recipientId: selectedStudent._id,
        senderRole: "teacher",
        content: newMessage,
        timestamp: new Date(),
      };

      // Mock API call - replace with actual endpoint
      await API.post("/messages", messageData);

      // Add message to local state
      setMessages([
        ...messages,
        {
          _id: Date.now(),
          ...messageData,
          sender: "teacher",
        },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchStudent.toLowerCase()),
  );

  const getUnreadCount = (studentId) => {
    return messages.filter((m) => m.sender !== "teacher" && !m.read).length;
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-96">
      {/* Students List */}
      <div className="bg-white p-6 shadow-lg rounded-lg lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>💬</span> Messages
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-3xl mb-2">👥</p>
              <p>No students found</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <button
                key={student._id}
                onClick={() => handleSelectStudent(student)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedStudent?._id === student._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs opacity-75">{student.email}</p>
                  </div>
                  {getUnreadCount(student._id) > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {getUnreadCount(student._id)}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white p-6 shadow-lg rounded-lg lg:col-span-3 flex flex-col">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-4xl mb-2">💭</p>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === "teacher" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "teacher"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "teacher"
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t pt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
              >
                <span>📤</span> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-6xl mb-4">💬</p>
              <p className="text-xl font-semibold mb-2">Select a student</p>
              <p>Choose a student from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
