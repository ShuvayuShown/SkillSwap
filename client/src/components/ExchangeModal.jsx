import React, { useState } from 'react';
import { X, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestApi } from '../services/api';

export const ExchangeModal = ({ receiver, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [learningSkill, setLearningSkill] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [customLearning, setCustomLearning] = useState('');
  const [customOffered, setCustomOffered] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !receiver) return null;

  const receiverTeaches = receiver.skillsToTeach || [];
  const senderTeaches = user?.skillsToTeach || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalLearningSkill = learningSkill === '__custom__' ? customLearning.trim() : learningSkill;
    const finalOfferedSkill = offeredSkill === '__custom__' ? customOffered.trim() : offeredSkill;

    if (!finalLearningSkill) {
      showToast('error', 'Please choose or enter what you want to learn.');
      return;
    }
    if (!finalOfferedSkill) {
      showToast('error', 'Please choose or enter what skill you are offering.');
      return;
    }

    setSubmitting(true);
    try {
      await requestApi.createRequest({
        receiverId: receiver._id,
        learningSkill: finalLearningSkill,
        offeredSkill: finalOfferedSkill,
        message: message.trim()
      });
      showToast('success', `Exchange request sent to ${receiver.name}!`);
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
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Propose Skill Swap</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Collaborate with {receiver.name}</p>
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
            {/* Skill You Want to Learn */}
            <div className="form-group">
              <label className="form-label">
                What do you want to learn from {receiver.name.split(' ')[0]}?
              </label>
              {receiverTeaches.length > 0 ? (
                <select
                  className="form-select"
                  value={learningSkill}
                  onChange={(e) => setLearningSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill taught by {receiver.name}...</option>
                  {receiverTeaches.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name} ({s.level} - {s.category})
                    </option>
                  ))}
                  <option value="__custom__">+ Other / Custom Topic</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Python, Video Editing, Guitar"
                  value={learningSkill}
                  onChange={(e) => setLearningSkill(e.target.value)}
                  required
                />
              )}

              {learningSkill === '__custom__' && (
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '8px' }}
                  placeholder="Specify custom topic or framework..."
                  value={customLearning}
                  onChange={(e) => setCustomLearning(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Skill You Offer in Return */}
            <div className="form-group">
              <label className="form-label">What skill will you teach in return?</label>
              {senderTeaches.length > 0 ? (
                <select
                  className="form-select"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  required
                >
                  <option value="">Select one of your teaching skills...</option>
                  {senderTeaches.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name} ({s.level} - {s.category})
                    </option>
                  ))}
                  <option value="__custom__">+ Other skill not on my profile yet</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Java, Figma, Spanish"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  required
                />
              )}

              {offeredSkill === '__custom__' && (
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '8px' }}
                  placeholder="Specify custom skill to teach..."
                  value={customOffered}
                  onChange={(e) => setCustomOffered(e.target.value)}
                  required
                />
              )}

              {senderTeaches.length === 0 && (
                <p style={{ fontSize: '0.785rem', color: 'var(--warning)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> Tip: Add your skills on the Manage Skills page to make swapping instant!
                </p>
              )}
            </div>

            {/* Note/Message */}
            <div className="form-group">
              <label className="form-label">Message / Introduction (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Hey! I would love to pair up for 2 hours a week to exchange knowledge..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
              <div className="form-helper" style={{ textAlign: 'right' }}>
                {message.length}/500
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending Request...' : 'Send Exchange Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeModal;
