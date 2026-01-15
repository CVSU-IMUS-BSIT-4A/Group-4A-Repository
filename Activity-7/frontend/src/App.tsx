import { useState, useEffect } from 'react';
import type { Task, Project, User, CreateTaskDto, CreateProjectDto, CreateUserDto } from './types';
import { taskAPI, projectAPI, userAPI } from './services/api';
import TaskCard from './components/TaskCard';
import ProjectCard from './components/ProjectCard';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import UserModal from './components/UserModal';
import './App.css';

type View = 'dashboard' | 'projects' | 'tasks' | 'users';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setError('');
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        taskAPI.getAll(),
        projectAPI.getAll(),
        userAPI.getAll(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running.');
      console.error(err);
    }
  };

  // Task handlers
  const handleCreateTask = async (data: CreateTaskDto) => {
    await taskAPI.create(data);
    await loadAllData();
  };

  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (editingTask) {
      await taskAPI.update(editingTask.id, data);
      await loadAllData();
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await taskAPI.delete(id);
      await loadAllData();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  // Project handlers
  const handleCreateProject = async (data: CreateProjectDto) => {
    await projectAPI.create(data);
    await loadAllData();
  };

  const handleUpdateProject = async (data: CreateProjectDto) => {
    if (editingProject) {
      await projectAPI.update(editingProject.id, data);
      await loadAllData();
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await projectAPI.delete(id);
      await loadAllData();
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  // User handlers
  const handleCreateUser = async (data: CreateUserDto) => {
    await userAPI.create(data);
    await loadAllData();
  };

  const handleUpdateUser = async (data: CreateUserDto) => {
    if (editingUser) {
      await userAPI.update(editingUser.id, data);
      await loadAllData();
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await userAPI.delete(id);
      await loadAllData();
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  // View project tasks
  const handleViewProjectTasks = (projectId: number) => {
    setSelectedProjectId(projectId);
    setView('tasks');
  };

  // Get filtered tasks
  const getFilteredTasks = () => {
    if (selectedProjectId) {
      return tasks.filter(task => task.project?.id === selectedProjectId);
    }
    return tasks;
  };

  // Get task count for a project
  const getProjectTaskCount = (projectId: number) => {
    return tasks.filter(task => task.project?.id === projectId).length;
  };

  // Get statistics
  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    totalUsers: users.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    overdueTasks: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length,
  };

  const filteredTasks = getFilteredTasks();
  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">📋 Task Management System</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setView('dashboard');
            setSelectedProjectId(null);
          }}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${view === 'projects' ? 'active' : ''}`}
          onClick={() => {
            setView('projects');
            setSelectedProjectId(null);
          }}
        >
          📁 Projects
        </button>
        <button
          className={`nav-btn ${view === 'tasks' ? 'active' : ''}`}
          onClick={() => {
            setView('tasks');
            setSelectedProjectId(null);
          }}
        >
          ✅ Tasks
        </button>
        <button
          className={`nav-btn ${view === 'users' ? 'active' : ''}`}
          onClick={() => {
            setView('users');
            setSelectedProjectId(null);
          }}
        >
          👥 Users
        </button>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {view === 'dashboard' && (
          <div className="dashboard">
            <h2 className="section-title">Dashboard Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-value">{stats.totalProjects}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">✔️</div>
                <div className="stat-value">{stats.completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{stats.inProgressTasks}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card danger">
                <div className="stat-icon">⚠️</div>
                <div className="stat-value">{stats.overdueTasks}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>

            <div className="dashboard-sections">
              <section>
                <h3 className="subsection-title">Recent Projects</h3>
                <div className="projects-grid">
                  {projects.slice(0, 3).map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      taskCount={getProjectTaskCount(project.id)}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onViewTasks={handleViewProjectTasks}
                    />
                  ))}
                </div>
                {projects.length === 0 && (
                  <p className="empty-message">No projects yet. Create your first project!</p>
                )}
              </section>

              <section>
                <h3 className="subsection-title">Recent Tasks</h3>
                <div className="tasks-grid">
                  {tasks.slice(0, 6).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
                {tasks.length === 0 && (
                  <p className="empty-message">No tasks yet. Create your first task!</p>
                )}
              </section>
            </div>
          </div>
        )}

        {view === 'projects' && (
          <div className="projects-view">
            <div className="view-header">
              <h2 className="section-title">Projects</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingProject(null);
                  setProjectModalOpen(true);
                }}
              >
                ➕ New Project
              </button>
            </div>
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={getProjectTaskCount(project.id)}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onViewTasks={handleViewProjectTasks}
                />
              ))}
            </div>
            {projects.length === 0 && (
              <p className="empty-message">No projects found. Create your first project!</p>
            )}
          </div>
        )}

        {view === 'tasks' && (
          <div className="tasks-view">
            <div className="view-header">
              <div>
                <h2 className="section-title">
                  {selectedProject ? `${selectedProject.name} - Tasks` : 'All Tasks'}
                </h2>
                {selectedProject && (
                  <button
                    className="btn-back"
                    onClick={() => setSelectedProjectId(null)}
                  >
                    ← Back to all tasks
                  </button>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingTask(null);
                  setTaskModalOpen(true);
                }}
              >
                ➕ New Task
              </button>
            </div>
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            {filteredTasks.length === 0 && (
              <p className="empty-message">No tasks found. Create your first task!</p>
            )}
          </div>
        )}

        {view === 'users' && (
          <div className="users-view">
            <div className="view-header">
              <h2 className="section-title">Users</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingUser(null);
                  setUserModalOpen(true);
                }}
              >
                ➕ New User
              </button>
            </div>
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div>
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="btn-icon btn-edit" onClick={() => handleEditUser(user)}>
                      ✏️
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDeleteUser(user.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {users.length === 0 && (
              <p className="empty-message">No users found. Create your first user!</p>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={projects}
        users={users}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        project={editingProject}
      />

      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={editingUser ? handleUpdateUser : handleCreateUser}
        user={editingUser}
      />
    </div>
  );
}

export default App;
