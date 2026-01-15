export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  imageUrl: string;
  releaseYear: number;
  averageRating: number;
  reviews?: Review[];
}

export interface Review {
  id: number;
  reviewerName: string;
  comment: string;
  rating: number;
  movieId: number;
  createdAt: string;
}

export interface CreateMovieDto {
  title: string;
  description?: string;
  genre: string;
  imageUrl: string;
  releaseYear: number;
}

export interface CreateReviewDto {
  reviewerName: string;
  comment: string;
  rating: number;
  movieId: number;
}
