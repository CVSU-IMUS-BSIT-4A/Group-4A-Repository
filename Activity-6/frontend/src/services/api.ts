import axios from 'axios';
import { Movie, Review, CreateMovieDto, CreateReviewDto } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const moviesApi = {
  getAll: async (): Promise<Movie[]> => {
    const response = await api.get<Movie[]>('/movies');
    return response.data;
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  create: async (movie: CreateMovieDto): Promise<Movie> => {
    const response = await api.post<Movie>('/movies', movie);
    return response.data;
  },

  update: async (id: number, movie: Partial<CreateMovieDto>): Promise<Movie> => {
    const response = await api.patch<Movie>(`/movies/${id}`, movie);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/movies/${id}`);
  },
};

export const reviewsApi = {
  getAll: async (movieId?: number): Promise<Review[]> => {
    const url = movieId ? `/reviews?movieId=${movieId}` : '/reviews';
    const response = await api.get<Review[]>(url);
    return response.data;
  },

  getById: async (id: number): Promise<Review> => {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },

  create: async (review: CreateReviewDto): Promise<Review> => {
    const response = await api.post<Review>('/reviews', review);
    return response.data;
  },

  update: async (id: number, review: Partial<CreateReviewDto>): Promise<Review> => {
    const response = await api.patch<Review>(`/reviews/${id}`, review);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
