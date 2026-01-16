import React, { useEffect, useState } from "react";
import RoomsList from "./components/RoomsList";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  // LOAD CHATROOMS (REST API)
  useEffect(() => {
    fetch("http://localhost:3000/chatrooms")
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  // LOAD MESSAGES WHEN ROOM CHANGES
  useEffect(() => {
    if (!currentRoom) return;

    fetch(`http://localhost:3000/messages/chatroom/${currentRoom}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, [currentRoom]);

  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
  };

  const sendMessage = (text) => {
    if (!text || !currentRoom) return;

    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatroomId: currentRoom,
        username: "Guest",
        message: text
      })
    })
      .then(res => res.json())
      .then(newMsg => setMessages(prev => [...prev, newMsg]));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat App</h2>

      <RoomsList rooms={rooms} joinRoom={joinRoom} />

      {currentRoom && (
        <>
          <ChatRoom messages={messages} />
          <input
            placeholder="Type message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
