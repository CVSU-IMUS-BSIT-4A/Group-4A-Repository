import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add token to requests if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  author?: User;
  postId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    client.post<{ access_token: string; user: User }>('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    client.post<User>('/users', { name, email, password }),
};

// Users API
export const usersAPI = {
  getAll: (page = 1, limit = 10) =>
    client.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  
  getById: (id: number) =>
    client.get<User>(`/users/${id}`),
  
  update: (id: number, data: Partial<User>) =>
    client.patch<User>(`/users/${id}`, data),
  
  delete: (id: number) =>
    client.delete(`/users/${id}`),
};

// Posts API
export const postsAPI = {
  create: (title: string, content: string, authorId?: number) =>
    client.post<Post>('/posts', { title, content, authorId }),
  
  getAll: (page = 1, limit = 10) =>
    client.get<PaginatedResponse<Post>>(`/posts?page=${page}&limit=${limit}`),
  
  getById: (id: number) =>
    client.get<Post>(`/posts/${id}`),
  
  update: (id: number, data: Partial<{ title: string; content: string }>) =>
    client.patch<Post>(`/posts/${id}`, data),
  
  delete: (id: number) =>
    client.delete(`/posts/${id}`),
};

// Comments API
export const commentsAPI = {
  create: (postId: number, content: string, authorId?: number) =>
    client.post<Comment>(`/posts/${postId}/comments`, { content, authorId }),
  
  getByPost: (postId: number, page = 1, limit = 10) =>
    client.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments?page=${page}&limit=${limit}`),
  
  delete: (postId: number, commentId: number) =>
    client.delete(`/posts/${postId}/comments/${commentId}`),
};

export default client;


