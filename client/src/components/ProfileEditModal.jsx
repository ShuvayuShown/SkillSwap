import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../services/api';

export const ProfileEditModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !college.trim()) {
      showToast('error', 'Name and college cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: name.trim(),
        college: college.trim(),
        bio: bio.trim(),
        profileImage: profileImage.trim()
      });

      setUser((prev) => ({
        ...prev,
        ...res.user
      }));

      showToast('success', 'Profile updated successfully!');
      if (onSuccess) onSuccess(res.user);
      onClose();
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setSaving(false);
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
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Edit Profile</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Keep your student info up to date</p>
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
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                className="form-input"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
              <div className="form-helper">Paste any direct image URL (Unsplash, Imgur, GitHub avatar)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / About You</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Share your background, interests, and what you are building..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
              <div className="form-helper" style={{ textAlign: 'right' }}>
                {bio.length}/500
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
