import React, { useState } from 'react';
import './CreateRoomForm.css';

export default function CreateRoomForm({ createRoom }) {
  const [showForm, setShowForm] = useState(false); 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return alert('Room name required');
    
    createRoom({ name, description, icon });
    
  
    setName('');
    setDescription('');
    setIcon('');
    setShowForm(false);
  };

  
  if (!showForm) {
    return (
      <button 
        className="toggle-form-btn" 
        onClick={() => setShowForm(true)}
      >
        + Create New Room
      </button>
    );
  }


  return (
    <div className="create-room-container">
      <form className="create-room-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>New Room</h3>
          <button 
            type="button" 
            className="close-btn" 
            onClick={() => setShowForm(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Icon (e.g., 🚀)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="create-btn">Create</button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}