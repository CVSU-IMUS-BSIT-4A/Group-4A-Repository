import React, { useState } from 'react';
import './ChatInput.css';

export default function ChatInput({ sendMessage }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;
    sendMessage(text);
    setText('');
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input-field"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button className="send-button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}