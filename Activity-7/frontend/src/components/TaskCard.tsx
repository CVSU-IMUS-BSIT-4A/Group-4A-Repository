import type { Task } from '../types';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      backlog: '#6b7280',
      todo: '#3b82f6',
      in_progress: '#f59e0b',
      in_review: '#8b5cf6',
      done: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const getApprovalColor = (approval: string) => {
    const colors: Record<string, string> = {
      approved: '#10b981',
      pending: '#f59e0b',
      overdue: '#ef4444',
    };
    return colors[approval] || '#6b7280';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && task.status !== 'done';
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button className="btn-icon btn-edit" onClick={() => onEdit(task)} title="Edit">
            ✏️
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(task.id)} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-badges">
          <span className="badge badge-status" style={{ backgroundColor: getStatusColor(task.status) }}>
            {task.status.replace('_', ' ')}
          </span>
          <span className="badge badge-approval" style={{ backgroundColor: getApprovalColor(task.approvalStatus) }}>
            {task.approvalStatus}
          </span>
        </div>

        <div className="task-info">
          {task.deadline && (
            <div className={`task-deadline ${isOverdue(task.deadline) ? 'overdue' : ''}`}>
              📅 {formatDate(task.deadline)}
              {isOverdue(task.deadline) && <span className="overdue-badge">Overdue!</span>}
            </div>
          )}

          {task.assignedTo && (
            <div className="task-assigned">
              👤 {task.assignedTo.name}
            </div>
          )}

          {task.project && (
            <div className="task-project">
              📁 {task.project.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
