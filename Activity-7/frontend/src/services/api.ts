// API service for backend communication
import type { User, Project, Task, CreateUserDto, CreateProjectDto, CreateTaskDto } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// User API
export const userAPI = {
  getAll: () => fetchAPI<User[]>('/users'),
  getOne: (id: number) => fetchAPI<User>(`/users/${id}`),
  create: (data: CreateUserDto) => fetchAPI<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<CreateUserDto>) => fetchAPI<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<void>(`/users/${id}`, { method: 'DELETE' }),
};

// Project API
export const projectAPI = {
  getAll: () => fetchAPI<Project[]>('/projects'),
  getOne: (id: number) => fetchAPI<Project>(`/projects/${id}`),
  create: (data: CreateProjectDto) => fetchAPI<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<CreateProjectDto>) => fetchAPI<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<void>(`/projects/${id}`, { method: 'DELETE' }),
};

// Task API
export const taskAPI = {
  getAll: () => fetchAPI<Task[]>('/tasks'),
  getOne: (id: number) => fetchAPI<Task>(`/tasks/${id}`),
  getByProject: (projectId: number) => fetchAPI<Task[]>(`/tasks?projectId=${projectId}`),
  create: (data: CreateTaskDto) => fetchAPI<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<CreateTaskDto>) => fetchAPI<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
