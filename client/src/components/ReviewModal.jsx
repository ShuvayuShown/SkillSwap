import React, { useState } from 'react';
import { X, Star, HeartHandshake } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { reviewApi } from '../services/api';
import StarRating from './StarRating';

export const ReviewModal = ({ exchange, isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !exchange) return null;

  const partnerName = exchange.partnerName || 'Peer Student';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('error', 'Please write a brief feedback comment.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.submitReview({
        exchangeRequestId: exchange._id,
        rating,
        comment: comment.trim()
      });
      showToast('success', 'Review submitted successfully! Thank you.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706'
              }}
            >
              <HeartHandshake size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Review Exchange</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Feedback for {partnerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Rating Selector */}
            <div className="form-group" style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
                How would you rate your learning exchange?
              </label>
              <StarRating rating={rating} size={28} interactive onRatingChange={(val) => setRating(val)} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', marginTop: '6px' }}>
                {rating === 5 && 'Outstanding Exchange (5/5)'}
                {rating === 4 && 'Great Session (4/5)'}
                {rating === 3 && 'Average (3/5)'}
                {rating === 2 && 'Needs Improvement (2/5)'}
                {rating === 1 && 'Poor Experience (1/5)'}
              </div>
            </div>

            {/* Written Comment */}
            <div className="form-group">
              <label className="form-label">Written Feedback</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="What did you learn? How was their teaching style and punctuality?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                minLength={5}
                maxLength={1000}
              />
              <div className="form-helper" style={{ textAlign: 'right' }}>
                {comment.length}/1000
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
