import React from 'react';
import { Review } from '../types';
import './ReviewList.css';

interface ReviewListProps {
  reviews: Review[];
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onEdit, onDelete }) => {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="review-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleDelete = (reviewId: number, reviewerName: string) => {
    if (window.confirm(`Are you sure you want to delete ${reviewerName}'s review?`)) {
      onDelete?.(reviewId);
    }
  };

  return (
    <div className="review-list">
      <h3 className="review-list-title">Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="reviewer-name">{review.reviewerName}</span>
            {renderStars(review.rating)}
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
          <div className="review-actions">
            {onEdit && (
              <button 
                className="review-edit-btn"
                onClick={() => onEdit(review)}
                title="Edit review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="review-delete-btn"
                onClick={() => handleDelete(review.id, review.reviewerName)}
                title="Delete review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
