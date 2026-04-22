import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating = 0, onRate, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            className={`star-btn ${filled ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            style={{ fontSize: size }}
          >
            {filled ? <FaStar /> : <FiStar />}
          </button>
        );
      })}
      {rating > 0 && (
        <span className="star-rating-value">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
