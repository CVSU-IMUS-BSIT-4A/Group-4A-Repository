import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { PencilSquare, Trash3 } from 'react-bootstrap-icons';
import '../index.css';

const TodoForm = ({ onTaskAdded, fetchTasks, tasks }) => {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [fadeOutIds, setFadeOutIds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fetchCompletedTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/tasks');
      const completedTasks = res.data
        .filter(task => task.completed)
        .map(task => task.title);
      setSuggestions(completedTasks);
      console.log('Completed tasks for suggestions:', completedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post('http://localhost:3000/tasks', {
        title,
        completed: false,
      });
      setTitle('');
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      onTaskAdded();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCheckboxClick = (task) => {
    if (!task.completed) {
      setConfirmId(task.id);
    }
  };

  const handleConfirmYes = async (id) => {
    setFadeOutIds((prev) => [...prev, id]);
    setConfirmId(null);

    setTimeout(async () => {
      try {
        await axios.put(`http://localhost:3000/tasks/${id}`, {
          completed: true
        });
        setFadeOutIds((prev) => prev.filter(fid => fid !== id));
        
        await fetchCompletedTasks();
        
        onTaskAdded();
      } catch (error) {
        console.error('Error updating task:', error);
        setFadeOutIds((prev) => prev.filter(fid => fid !== id));
      }
    }, 500);
  };

  const handleConfirmNo = (id) => {
    setConfirmId(null);
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`http://localhost:3000/tasks/${id}`, {
        title: editTitle,
      });
      setEditingId(null);
      setEditTitle('');
      onTaskAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="todo-container">
      <h2 className="todo-title">Todo List App</h2>

      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group position-relative w-100">
          <input
            type="text"
            className="form-control mb-3 line-animate"
            placeholder="Enter task title..."
            value={title}
            onFocus={async () => {
              setShowSuggestions(true);
              await fetchCompletedTasks();
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim() === '') {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
          />
          {showSuggestions && (
            <ul className="suggestion-list">
              {suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <li
                    key={i}
                    onMouseDown={() => {
                      setTitle(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </li>
                ))
              ) : (
                <li className="no-suggestions">
                  No completed tasks available for suggestions
                </li>
              )}
            </ul>
          )}
        </div>
        <Button type="submit" className="add-btn">
          Add Task
        </Button>
      </form>

      <div className="task-list mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${fadeOutIds.includes(task.id) ? 'fade-out' : ''}`}
          >
            {editingId === task.id ? (
              <div className="edit-row w-100">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <div className="d-flex gap-2">
                  <Button variant="light" onClick={() => handleSaveEdit(task.id)}>
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : confirmId === task.id ? (
              <div className="confirm-row w-100 d-flex justify-content-between align-items-center">
                <span>Mark "{task.title}" as complete?</span>
                <div className="d-flex gap-2">
                  <Button variant="success" onClick={() => handleConfirmYes(task.id)}>
                    Yes
                  </Button>
                  <Button variant="secondary" onClick={() => handleConfirmNo(task.id)}>
                    No
                  </Button>
                </div>
              </div>
            ) : (
              <div className="task-display w-100 d-flex justify-content-between align-items-center">
                <div className="task-text">
                  <strong>{task.title}</strong>
                </div>
                <div className="task-actions d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheckboxClick(task)}
                  />
                  <Button variant="light" onClick={() => handleEdit(task)}>
                    <PencilSquare color="#4E796B" />
                  </Button>
                  <Button variant="light" onClick={() => handleDelete(task.id)}>
                    <Trash3 color="red" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoForm;
