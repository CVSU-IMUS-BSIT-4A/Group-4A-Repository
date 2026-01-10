import React, { useState, useEffect } from 'react';
import { Movie, Review, CreateReviewDto } from '../types';
import { reviewsApi } from '../services/api';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './MovieDetail.css';

interface MovieDetailProps {
  movie: Movie;
  onReviewAdded: () => void;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onReviewAdded, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [movie.id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.getAll(movie.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: CreateReviewDto) => {
    try {
      await reviewsApi.create(reviewData);
      setShowReviewForm(false);
      await loadReviews();
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating-large">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={i} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={i} className="star">★</span>
        ))}
        <span className="rating-text-large">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <>
      <div className="movie-detail-overlay" onClick={onClose}>
        <div className="movie-detail-container" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>×</button>
          
          <div className="movie-detail-content">
            <div className="movie-detail-image">
              <img 
                src={`http://localhost:3001/movies/proxy-image?url=${encodeURIComponent(movie.imageUrl)}`} 
                alt={movie.title}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  // Fallback to direct URL if proxy fails
                  if (img.src.includes('proxy-image')) {
                    img.src = movie.imageUrl;
                  }
                }}
              />
            </div>
            
            <div className="movie-detail-info">
              <h2 className="movie-detail-title">{movie.title}</h2>
              <p className="movie-detail-meta">{movie.genre} • {movie.releaseYear}</p>
              
              {movie.averageRating > 0 && (
                <div className="movie-detail-rating">
                  {renderStars(movie.averageRating)}
                </div>
              )}
              
              <p className="movie-detail-description">{movie.description}</p>
              
              <button 
                className="add-review-button"
                onClick={() => setShowReviewForm(true)}
              >
                + Add Your Review
              </button>
              
              {loading ? (
                <div className="loading">Loading reviews...</div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          movieId={movie.id}
          movieTitle={movie.title}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </>
  );
};

export default MovieDetail;
