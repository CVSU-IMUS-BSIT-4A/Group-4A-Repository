import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Author {
  id: number;
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
  books?: Book[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  books?: Book[];
}

export interface Book {
  id: number;
  title: string;
  description?: string;
  isbn: string;
  publicationYear: number;
  pageCount: number;
  coverImage?: string;
  price?: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  categoryId: number;
  author?: Author;
  category?: Category;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Authors API
export const authorsAPI = {
  getAll: (page = 1, limit = 10) =>
    client.get<PaginatedResponse<Author>>(`/authors?page=${page}&limit=${limit}`),
  
  getById: (id: number) =>
    client.get<Author>(`/authors/${id}`),
  
  create: (data: Partial<Author>) =>
    client.post<Author>('/authors', data),
  
  update: (id: number, data: Partial<Author>) =>
    client.patch<Author>(`/authors/${id}`, data),
  
  delete: (id: number) =>
    client.delete(`/authors/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (page = 1, limit = 10) =>
    client.get<PaginatedResponse<Category>>(`/categories?page=${page}&limit=${limit}`),
  
  getById: (id: number) =>
    client.get<Category>(`/categories/${id}`),
  
  create: (data: Partial<Category>) =>
    client.post<Category>('/categories', data),
  
  update: (id: number, data: Partial<Category>) =>
    client.patch<Category>(`/categories/${id}`, data),
  
  delete: (id: number) =>
    client.delete(`/categories/${id}`),
};

// Books API
export const booksAPI = {
  getAll: (page = 1, limit = 10) =>
    client.get<PaginatedResponse<Book>>(`/books?page=${page}&limit=${limit}`),
  
  getById: (id: number) =>
    client.get<Book>(`/books/${id}`),
  
  getByAuthor: (authorId: number, page = 1, limit = 10) =>
    client.get<PaginatedResponse<Book>>(`/books/author/${authorId}?page=${page}&limit=${limit}`),
  
  getByCategory: (categoryId: number, page = 1, limit = 10) =>
    client.get<PaginatedResponse<Book>>(`/books/category/${categoryId}?page=${page}&limit=${limit}`),
  
  create: (data: Partial<Book>) =>
    client.post<Book>('/books', data),
  
  update: (id: number, data: Partial<Book>) =>
    client.patch<Book>(`/books/${id}`, data),
  
  delete: (id: number) =>
    client.delete(`/books/${id}`),
};

export default client;
