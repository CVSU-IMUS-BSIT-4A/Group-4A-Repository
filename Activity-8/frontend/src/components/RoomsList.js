import React from 'react';
import CreateRoomForm from './CreateRoomForm'; 
import './RoomsList.css'; 

export default function RoomsList({ rooms, joinRoom, activeRoomId, createRoom }) {
  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h4>Channels</h4>
      </div>
      
      <div className="room-items">
        {rooms.map(room => (
          <div 
            key={room.id} 
            className={`room-item ${activeRoomId === room.id ? 'active' : ''}`}
            onClick={() => joinRoom(room.id)}
          >
            <span className="room-icon">{room.icon || '#️'}</span>
            <div className="room-info">
              <span className="room-name">{room.name}</span>
              <span className="room-user-count">{room.userCount || 0} online</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <CreateRoomForm createRoom={createRoom} />
      </div>
    </div>
  );
}