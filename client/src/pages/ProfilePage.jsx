import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  Edit3,
  Calendar,
  MessageSquareQuote,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SkillBadge from '../components/SkillBadge';
import StarRating from '../components/StarRating';
import ExchangeModal from '../components/ExchangeModal';
import ProfileEditModal from '../components/ProfileEditModal';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const isSelf = currentUser && student && currentUser._id === student._id;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUserById(id);
      if (res.success && res.user) {
        setStudent(res.user);
      }
    } catch (err) {
      setError(err.message || 'Student profile not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
        <Navbar />
        <div className="container" style={{ flex: 1, padding: '60px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Profile Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'The requested student profile does not exist.'}</p>
          <Link to="/explore" className="btn btn-primary">
            Back to Explore
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const reviews = student.reviews || [];
  const teachSkills = student.skillsToTeach || [];
  const learnSkills = student.skillsToLearn || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '36px 0 60px 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Back breadcrumb */}
          <Link
            to="/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '20px'
            }}
          >
            <ChevronLeft size={16} /> Back to Explore
          </Link>

          {/* Profile Header Card */}
          <div
            className="card"
            style={{
              padding: '36px',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div
                  className="avatar avatar-xl"
                  style={{
                    boxShadow: 'var(--shadow-md)',
                    border: '4px solid #ffffff'
                  }}
                >
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

                <div>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    {student.name}
                  </h1>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      marginTop: '4px'
                    }}
                  >
                    <MapPin size={16} color="var(--primary)" />
                    <span>{student.college}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '10px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StarRating rating={student.averageRating || 5.0} size={16} />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {student.averageRating || '5.0'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ({student.totalReviews || 0} reviews)
                      </span>
                    </div>

                    <span style={{ color: 'var(--border-medium)' }}>•</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> Joined {new Date(student.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Edit Profile (if self) or Swap Request (if peer) */}
              <div>
                {isSelf ? (
                  <button onClick={() => setIsEditProfileOpen(true)} className="btn btn-outline">
                    <Edit3 size={16} /> Edit My Profile
                  </button>
                ) : (
                  <button onClick={() => setIsExchangeOpen(true)} className="btn btn-primary btn-lg">
                    <ArrowLeftRight size={18} /> Propose Skill Swap
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            {student.bio && (
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.65',
                  fontSize: '0.95rem'
                }}
              >
                {student.bio}
              </div>
            )}
          </div>

          {/* Two-Column Skills Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '36px'
            }}
          >
            {/* Skills I Can Teach */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)'
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skills I Can Teach</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {teachSkills.length} skills offered to the community
                  </p>
                </div>
              </div>

              {teachSkills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {teachSkills.map((s) => (
                    <div
                      key={s._id}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-page)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {s.name}
                        </span>
                        <SkillBadge skill={s} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '4px' }}>
                        {s.category}
                      </div>
                      {s.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {s.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                  No teaching skills listed yet.
                </div>
              )}
            </div>

            {/* Skills I Want to Learn */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary)'
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skills I Want to Learn</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {learnSkills.length} target learning interests
                  </p>
                </div>
              </div>

              {learnSkills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {learnSkills.map((s) => (
                    <div
                      key={s._id}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-page)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {s.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--secondary-light)',
                            color: 'var(--secondary)',
                            fontWeight: 600
                          }}
                        >
                          Target: {s.level}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 500, marginBottom: '4px' }}>
                        {s.category}
                      </div>
                      {s.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                          {s.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                  No learning goals listed yet.
                </div>
              )}
            </div>
          </div>

          {/* Student Reviews & Ratings Section */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquareQuote size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Reviews & Feedback</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StarRating rating={student.averageRating || 5.0} size={18} />
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{student.averageRating || '5.0'}</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">
                          {rev.reviewer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>
                            {rev.reviewer?.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {rev.reviewer?.college}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <StarRating rating={rev.rating} size={14} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                No peer reviews submitted for {student.name} yet. Complete an exchange to leave a review!
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {isExchangeOpen && (
        <ExchangeModal
          receiver={student}
          isOpen={isExchangeOpen}
          onClose={() => setIsExchangeOpen(false)}
        />
      )}

      {isEditProfileOpen && (
        <ProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={(updated) => setStudent((prev) => ({ ...prev, ...updated }))}
        />
      )}
    </div>
  );
};

export default ProfilePage;
