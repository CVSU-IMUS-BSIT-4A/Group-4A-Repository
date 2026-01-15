import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import './ChatRoom.css';

export default function ChatRoom({ messages, sendMessage }) {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Live Chat</h3>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="message-wrapper">
              <div className="message-bubble">
                <span className="user-name">{msg.user}</span>
                <p className="message-text">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="chat-footer">
        <ChatInput sendMessage={sendMessage} />
      </div>
    </div>
  );
}