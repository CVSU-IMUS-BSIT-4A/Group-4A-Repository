import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Notes App</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Add New Note</h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Note
              </button>
            </form>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Your Notes</h2>
            
            {editingNote && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium mb-4">Edit Note</h3>
                <form onSubmit={handleUpdateNote} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Content"
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      className="w-full p-2 border rounded"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Update Note
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{note.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        disabled={editingNote?.id === note.id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{note.content}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-gray-500">No notes yet. Create your first note above!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
