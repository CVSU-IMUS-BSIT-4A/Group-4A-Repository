import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './dashboard.css';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      
      // If no token exists, trigger logout properly
      if (!token) {
        console.log('No token found, logging out');
        onLogout();
        return;
      }

      try {
        setError('');
        const response = await api.get('/notes');
        setNotes(response.data);
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        // If unauthorized, clear the invalid token and trigger logout
        if (error.response?.status === 401) {
          console.log('Invalid or expired token, logging out');
          localStorage.removeItem('token');
          onLogout();
        } else {
          setError('Failed to load notes. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [onLogout]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we still have a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      setError('');
      const response = await api.post('/notes', newNote);
      setNotes([...notes, response.data]);
      setNewNote({ title: '', content: '' });
      setShowModal(false); // Close modal after adding note
    } catch (err: any) {
      console.error('Error adding note:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        onLogout();
      } else {
        setError('Failed to add note. Please try again.');
      }
    }
  };

  const handleDeleteNote = async (id: number) => {
    // Check if we still have a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      setError('');
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err: any) {
      console.error('Error deleting note:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        onLogout();
      } else {
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditForm({ title: note.title, content: note.content });
    setShowEditModal(true);
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNote) return;
    
    // Check if we still have a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      setError('');
      const response = await api.patch(`/notes/${editingNote.id}`, editForm);
      setNotes(notes.map(note => 
        note.id === editingNote.id ? response.data : note
      ));
      setEditingNote(null);
      setEditForm({ title: '', content: '' });
      setShowEditModal(false);
    } catch (err: any) {
      console.error('Error updating note:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        onLogout();
      } else {
        setError('Failed to update note. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditForm({ title: '', content: '' });
    setShowEditModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="nav-title">📝 Notes App</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Header with Add Note Button */}
        <div className="dashboard-header">
          <h2 className="header-title">My Notes</h2>
          <button onClick={() => setShowModal(true)} className="add-note-btn">
            <span style={{ fontSize: '1.5rem' }}>+</span> Add New Note
          </button>
        </div>

        {/* Edit Form has been moved to a modal */}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">
              📭 No notes yet. Click "Add New Note" to create your first note!
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="note-action-btn note-edit-btn"
                      disabled={editingNote?.id === note.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="note-action-btn note-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="note-content">{note.content}</p>
                <p className="note-date">
                  📅 {new Date(note.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">✨ Create New Note</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close-btn"
                type="button"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddNote} className="note-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  placeholder="Enter note content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="form-input form-textarea"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {showEditModal && editingNote && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">✏️ Edit Note</h2>
              <button
                onClick={handleCancelEdit}
                className="modal-close-btn"
                type="button"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateNote} className="note-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  placeholder="Enter note content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  className="form-input form-textarea"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
