Movie Review Application

A full-stack application for managing movie reviews with ratings. Users can add reviews and ratings for movies, and the system automatically calculates and displays average ratings per movie.

Project Structure

Activity6/
  backend/          NestJS + TypeScript API
    src/
      movies/       Movie CRUD operations
      reviews/      Review CRUD operations
      main.ts       Application entry point
  
  frontend/         React + TypeScript UI
    src/
      components/   React components
      services/     API integration
      types/        TypeScript types

Features

Backend:
- CRUD operations for Movies
- CRUD operations for Reviews
- Automatic average rating calculation
- SQLite database (no external setup required)
- Swagger API documentation at http://localhost:3001/api
- TypeScript for type safety
- CORS enabled for frontend

Frontend:
- Pink-themed UI
- Movie cards with images
- Star-based rating visualization
- Add reviews with ratings
- View all reviews per movie
- Responsive design
- TypeScript for type safety

Quick Start

Prerequisites:
- Node.js (v14 or higher)
- npm or yarn

Option 1: Run both servers together
From the root directory:
  npm install
  npm start

This will start both backend (port 3001) and frontend (port 3000) simultaneously.

Option 2: Run servers separately

Backend Setup:
1. Navigate to backend directory:
   cd backend

2. Install dependencies:
   npm install

3. Start the development server:
   npm run start:dev

The backend will run on http://localhost:3001
Swagger documentation: http://localhost:3001/api

Frontend Setup:
1. Navigate to frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

The frontend will run on http://localhost:3000

Usage

1. Start the backend first (port 3001)
2. Start the frontend (port 3000)
3. The app will automatically load movies from the API
4. Click on any movie card to view details and add reviews
5. Use the Swagger UI at http://localhost:3001/api to add movies via API

Adding Sample Movies

You can add movies through:
1. Swagger UI: Visit http://localhost:3001/api and use the POST /movies endpoint
2. API directly: Make POST requests to http://localhost:3001/movies

Example movie payload:
{
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality",
  "genre": "Sci-Fi",
  "imageUrl": "https://example.com/matrix.jpg",
  "releaseYear": 1999
}

API Endpoints

Movies:
- GET /movies - Get all movies
- GET /movies/:id - Get movie by ID
- POST /movies - Create movie
- PATCH /movies/:id - Update movie
- DELETE /movies/:id - Delete movie

Reviews:
- GET /reviews - Get all reviews (optional: ?movieId=1)
- GET /reviews/:id - Get review by ID
- POST /reviews - Create review
- PATCH /reviews/:id - Update review
- DELETE /reviews/:id - Delete review

Technology Stack

Backend:
- Framework: NestJS
- Language: TypeScript
- Database: SQLite (TypeORM)
- API Docs: Swagger

Frontend:
- Framework: React
- Language: TypeScript
- HTTP Client: Axios
- Styling: CSS3 (Pink theme)

Database

The SQLite database (movie_reviews.db) is automatically created in the backend directory on first run. The database schema includes:

Movies: id, title, description, genre, imageUrl, releaseYear, averageRating
Reviews: id, reviewerName, comment, rating, movieId, createdAt

Average ratings are calculated automatically when reviews are added, updated, or deleted.

Notes

- Make sure the backend is running before starting the frontend
- CORS is configured to allow requests from http://localhost:3000
- The database file is created automatically - no manual setup required
- All ratings are on a scale of 1-5 stars

License: ISC
