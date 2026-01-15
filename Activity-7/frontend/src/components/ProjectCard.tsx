import type { Project } from '../types';
import '../styles/ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onViewTasks: (projectId: number) => void;
}

export default function ProjectCard({ project, taskCount, onEdit, onDelete, onViewTasks }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.name}</h3>
        <div className="project-actions">
          <button className="btn-icon btn-edit" onClick={() => onEdit(project)} title="Edit">
            ✏️
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(project.id)} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-footer">
        <div className="project-stats">
          <span className="task-count">📋 {taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
          <span className="created-date">📅 {formatDate(project.createdAt)}</span>
        </div>
        <button className="btn-view-tasks" onClick={() => onViewTasks(project.id)}>
          View Tasks →
        </button>
      </div>
    </div>
  );
}
