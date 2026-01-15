// Type definitions for the Task Management System

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  approvalStatus: 'approved' | 'pending' | 'overdue';
  project?: Project;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  deadline?: string;
  status?: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  approvalStatus?: 'approved' | 'pending' | 'overdue';
  projectId?: number;
  assignedToId?: number;
}
