import React from 'react';
import { Movie } from '../types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onAddReview: (movieId: number) => void;
  onViewDetails?: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onAddReview, onViewDetails }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(`http://localhost:3001/movies/proxy-image?url=${encodeURIComponent(movie.imageUrl)}`);

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(movie.id);
    }
  };

  const handleAddReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddReview(movie.id);
  };

  const handleImageError = () => {
    // Try direct URL as fallback if proxy fails
    if (imageSrc.includes('proxy-image')) {
      setImageSrc(movie.imageUrl);
    } else if (imageSrc === movie.imageUrl) {
      // If direct URL also fails, show placeholder
      setImageError(true);
    }
  };
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={i} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={i} className="star">★</span>
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="movie-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="movie-image-container">
        {imageError ? (
          <div className="movie-image-placeholder">
            <span className="placeholder-text">{movie.title}</span>
          </div>
        ) : (
          <img 
            src={imageSrc}
            alt={movie.title} 
            className="movie-image"
            onError={handleImageError}
          />
        )}
        <div className="movie-overlay">
          <button className="add-review-btn" onClick={handleAddReviewClick}>
            Add Review
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre} • {movie.releaseYear}</p>
        <p className="movie-description">{movie.description}</p>
        <div className="movie-rating">
          {movie.averageRating > 0 ? (
            renderStars(movie.averageRating)
          ) : (
            <span className="no-rating">No ratings yet</span>
          )}
        </div>
        {movie.reviews && movie.reviews.length > 0 && (
          <div className="review-count">
            {movie.reviews.length} review{movie.reviews.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
