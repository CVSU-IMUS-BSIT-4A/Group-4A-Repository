import React, { useState, useEffect } from 'react';
import { Movie, CreateReviewDto } from './types';
import { moviesApi, reviewsApi } from './services/api';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moviesApi.getAll();
      setMovies(data);
    } catch (err) {
      setError('Failed to load movies. Make sure the backend is running on http://localhost:3001');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (movieId: number) => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const handleViewDetails = (movieId: number) => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const handleReviewAdded = async () => {
    await loadMovies();
    if (selectedMovie) {
      const updatedMovie = await moviesApi.getById(selectedMovie.id);
      setSelectedMovie(updatedMovie);
    }
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  // Get unique genres
  const genres = ['All', ...Array.from(new Set(movies.map(m => m.genre)))].sort();

  const filteredMovies = movies.filter((movie) => {
    // Filter by genre
    if (selectedGenre !== 'All' && movie.genre !== selectedGenre) {
      return false;
    }
    
    // Filter by search term
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      movie.title.toLowerCase().includes(term) ||
      movie.genre.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">🎬 Movie Reviews</h1>
        <p className="app-subtitle">Discover and review your favorite movies</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="genre-tabs">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-tab ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <main className="app-main">
        {filteredMovies.length === 0 ? (
          <div className="empty-state">
            <p>No movies found. Try a different search or add new movies!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddReview={handleAddReview}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onReviewAdded={handleReviewAdded}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default App;
