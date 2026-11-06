import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { skillApi } from '../services/api';

const CATEGORIES = [
  'Programming',
  'Web Development',
  'App Development',
  'Data Science',
  'Artificial Intelligence',
  'UI/UX Design',
  'Graphic Design',
  'Video Editing',
  'Photography',
  'Communication',
  'Music',
  'Languages',
  'Business',
  'Other'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const AddSkillModal = ({ isOpen, onClose, type = 'teach', initialSkill = null, onSuccess }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name || '');
      setCategory(initialSkill.category || 'Programming');
      setLevel(initialSkill.level || 'Intermediate');
      setDescription(initialSkill.description || '');
    } else {
      setName('');
      setCategory('Programming');
      setLevel(type === 'teach' ? 'Intermediate' : 'Beginner');
      setDescription('');
    }
  }, [initialSkill, type, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!initialSkill;
  const isTeach = type === 'teach';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('error', 'Please enter a skill name.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        level,
        description: description.trim()
      };

      if (isTeach) {
        if (isEditing) {
          await skillApi.updateTeachingSkill(initialSkill._id, payload);
          showToast('success', 'Teaching skill updated successfully!');
        } else {
          await skillApi.addTeachingSkill(payload);
          showToast('success', 'New teaching skill added!');
        }
      } else {
        if (isEditing) {
          await skillApi.updateLearningSkill(initialSkill._id, payload);
          showToast('success', 'Learning interest updated successfully!');
        } else {
          await skillApi.addLearningSkill(payload);
          showToast('success', 'New learning interest added!');
        }
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
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
                backgroundColor: isTeach ? 'var(--primary-light)' : 'var(--secondary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isTeach ? 'var(--primary)' : 'var(--secondary)'
              }}
            >
              {isTeach ? <Sparkles size={18} /> : <BookOpen size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {isEditing ? 'Edit Skill' : isTeach ? 'Add Skill You Can Teach' : 'Add Skill You Want to Learn'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isTeach ? 'Share your expertise with peers' : 'Specify learning targets for recommendations'}
              </p>
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
            <div className="form-group">
              <label className="form-label">Skill Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Python, Figma, React, Public Speaking"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Proficiency Level</label>
                <select
                  className="form-select"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Topics Covered (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Specify what you can teach or what topics you want to explore..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
              <div className="form-helper" style={{ textAlign: 'right' }}>
                {description.length}/300
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Skill' : 'Save Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
