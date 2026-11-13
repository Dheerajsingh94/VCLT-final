import React, { useState } from 'react';
import { Modal } from './Modal';
import { Star, Send } from 'lucide-react';
import { submitUserFeedback } from '../../api/user';

export const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus({ success: false, message: 'Please enter your feedback comments.' });
      return;
    }

    setLoading(true);
    setStatus({ success: null, message: '' });

    try {
      await submitUserFeedback({ rating, feedbackmessage: message });
      setStatus({
        success: true,
        message: 'Thank you! Your feedback has been received.',
      });
      setTimeout(() => {
        setMessage('');
        setStatus({ success: null, message: '' });
        onClose();
      }, 1500);
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.message || 'Failed to submit feedback.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Feedback">
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
            How was your video calling & translation experience?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Star
                  size={32}
                  fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                  color={(hoverRating || rating) >= star ? '#fbbf24' : '#4b5563'}
                />
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '4px', fontWeight: 600 }}>
            {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating - 1]}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your Comments / Suggestions</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you loved or how we can improve..."
            required
          />
        </div>

        {status.message && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              backgroundColor: status.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: status.success ? '#6ee7b7' : '#fda4af',
              border: `1px solid ${status.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            }}
          >
            {status.message}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={16} />
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
