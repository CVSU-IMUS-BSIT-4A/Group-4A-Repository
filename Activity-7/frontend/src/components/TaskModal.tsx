import { useState, useEffect } from 'react';
import type { Task, CreateTaskDto, Project, User } from '../types';
import Modal from './Modal';
import '../styles/Form.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskDto) => Promise<void>;
  task?: Task | null;
  projects: Project[];
  users: User[];
}

export default function TaskModal({ isOpen, onClose, onSave, task, projects, users }: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    deadline: '',
    status: 'todo',
    approvalStatus: 'pending',
    projectId: undefined,
    assignedToId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline || '',
        status: task.status,
        approvalStatus: task.approvalStatus,
        projectId: task.project?.id,
        assignedToId: task.assignedTo?.id,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        status: 'todo',
        approvalStatus: 'pending',
        projectId: undefined,
        assignedToId: undefined,
      });
    }
    setError('');
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.projectId) delete dataToSend.projectId;
      if (!dataToSend.assignedToId) delete dataToSend.assignedToId;
      if (!dataToSend.deadline) delete dataToSend.deadline;
      if (!dataToSend.description) delete dataToSend.description;

      await onSave(dataToSend);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="task-title">Task Title *</label>
          <input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Design homepage"
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Task description..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-deadline">Deadline</label>
            <input
              id="task-deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status">Status *</label>
            <select
              id="task-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              required
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-approval">Approval Status *</label>
            <select
              id="task-approval"
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as any })}
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-project">Project</label>
            <select
              id="task-project"
              value={formData.projectId || ''}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-user">Assign To</label>
          <select
            id="task-user"
            value={formData.assignedToId || ''}
            onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
