import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ArrowLeftRight, Sparkles } from 'lucide-react';
import SkillBadge from './SkillBadge';
import StarRating from './StarRating';

export const StudentCard = ({ student, recommendationReason, onSendRequest }) => {
  if (!student) return null;

  const teachSkills = student.skillsToTeach || [];
  const learnSkills = student.skillsToLearn || [];

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top recommendation pill if provided */}
      {recommendationReason && (
        <div
          style={{
            margin: '-24px -24px 16px -24px',
            backgroundColor: '#f5f3ff',
            borderBottom: '1px solid #ddd6fe',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#6d28d9',
            fontWeight: 600
          }}
        >
          <Sparkles size={14} color="#7c3aed" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {recommendationReason}
          </span>
        </div>
      )}

      <div>
        {/* Student header info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div className="avatar avatar-md" style={{ flexShrink: 0 }}>
            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              student.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Link to={`/profile/${student._id}`} style={{ textDecoration: 'none' }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {student.name}
              </h3>
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <MapPin size={13} />
              <span>{student.college}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <StarRating rating={student.averageRating || 5.0} size={14} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {student.averageRating || '5.0'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({student.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        {student.bio && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.45',
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {student.bio}
          </p>
        )}

        {/* Skills I Can Teach */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--primary)',
              marginBottom: '6px'
            }}
          >
            Can Teach ({teachSkills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {teachSkills.length > 0 ? (
              teachSkills.slice(0, 3).map((s) => <SkillBadge key={s._id || s.name} skill={s} size="sm" />)
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No skills listed yet</span>
            )}
            {teachSkills.length > 3 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  alignSelf: 'center'
                }}
              >
                +{teachSkills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--secondary)',
              marginBottom: '6px'
            }}
          >
            Wants to Learn ({learnSkills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {learnSkills.length > 0 ? (
              learnSkills.slice(0, 3).map((s) => (
                <span
                  key={s._id || s.name}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    fontWeight: 500
                  }}
                >
                  {s.name}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open to any skills</span>
            )}
            {learnSkills.length > 3 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  alignSelf: 'center'
                }}
              >
                +{learnSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card action buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <Link
          to={`/profile/${student._id}`}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%' }}
        >
          View Profile
        </Link>
        <button
          onClick={() => onSendRequest && onSendRequest(student)}
          className="btn btn-primary btn-sm"
          style={{ width: '100%' }}
        >
          <ArrowLeftRight size={14} /> Swap
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
