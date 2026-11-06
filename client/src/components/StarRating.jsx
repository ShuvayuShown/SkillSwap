import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, max = 5, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <span
            key={index}
            className={interactive ? 'star-interactive' : ''}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              display: 'inline-flex',
              padding: interactive ? '2px' : '0'
            }}
          >
            <Star
              size={size}
              className={isFilled ? 'filled' : ''}
              fill={isFilled ? '#f59e0b' : 'none'}
              stroke={isFilled ? '#f59e0b' : '#cbd5e1'}
            />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
