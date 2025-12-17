import React, { useState } from 'react';
import { CreateReviewDto } from '../types';
import './ReviewForm.css';

interface ReviewFormProps {
  movieId: number;
  movieTitle: string;
  onSubmit: (review: CreateReviewDto) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, movieTitle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateReviewDto>({
    reviewerName: '',
    comment: '',
    rating: 5,
    movieId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.reviewerName.trim() && formData.comment.trim()) {
      onSubmit(formData);
      setFormData({
        reviewerName: '',
        comment: '',
        rating: 5,
        movieId,
      });
    }
  };

  return (
    <div className="review-form-overlay" onClick={onCancel}>
      <div className="review-form-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="review-form-title">Add Review for {movieTitle}</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="reviewerName">Your Name</label>
            <input
              type="text"
              id="reviewerName"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-star ${formData.rating >= rating ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, rating })}
                >
                  ★
                </button>
              ))}
              <span className="rating-value">{formData.rating} / 5</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review</label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={5}
              placeholder="Write your review here..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
