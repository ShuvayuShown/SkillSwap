import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Send,
  Star,
  Plus,
  Compass,
  Menu,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StudentCard from '../components/StudentCard';
import ExchangeModal from '../components/ExchangeModal';
import AddSkillModal from '../components/AddSkillModal';
import ProfileEditModal from '../components/ProfileEditModal';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';

export const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [exchangeTarget, setExchangeTarget] = useState(null);
  const [addSkillType, setAddSkillType] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardApi.getStats();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    teachingCount: user?.skillsToTeach?.length || 0,
    learningCount: user?.skillsToLearn?.length || 0,
    incomingPending: 0,
    outgoingPending: 0,
    acceptedCount: 0,
    completedCount: 0,
    totalReviews: 0,
    averageRating: 5.0
  };

  const recommendations = dashboardData?.recommendations || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        {/* Mobile Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}
          className="dashboard-mobile-header"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              padding: '8px'
            }}
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            Skill<span style={{ color: 'var(--primary)' }}>Swap</span>
          </div>
          <div style={{ width: '32px' }} />
        </div>

        {/* Welcome Profile Hero Card */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            color: '#ffffff',
            padding: '32px',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              className="avatar avatar-xl"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  marginBottom: '8px'
                }}
              >
                <MapPin size={13} /> {user?.college}
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: '520px' }}>
                {user?.bio || 'Add a bio to let other students know what projects you are building and what you love learning.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="btn btn-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setAddSkillType('teach')}
              className="btn btn-sm"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </div>

        {/* Real Backend Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '18px',
            marginBottom: '36px'
          }}
        >
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Teaching Skills</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Sparkles size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.teachingCount}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Listed on your profile
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Learning Goals</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <BookOpen size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {stats.learningCount}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Skills you want to master
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Incoming Requests</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fffbeb', color: '#b45309' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>
              {stats.incomingPending}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Awaiting your response
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Completed Swaps</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
              {stats.completedCount}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Successful exchanges
            </div>
          </div>
        </div>

        {/* Core Skill Matching Recommendation Section */}
        <section style={{ marginBottom: '44px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Recommended For You
                </h2>
                <span className="badge badge-primary">Smart Match</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Students whose teaching skills complement your learning goals.
              </p>
            </div>

            <Link to="/explore" className="btn btn-outline btn-sm">
              <Compass size={16} /> Explore All Students
            </Link>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid-cards">
              {recommendations.map((rec) => (
                <StudentCard
                  key={rec.student._id}
                  student={rec.student}
                  recommendationReason={rec.primaryReason}
                  onSendRequest={(st) => setExchangeTarget(st)}
                />
              ))}
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 24px',
                backgroundColor: '#ffffff'
              }}
            >
              <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Add more skills to see tailored matches!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px auto' }}>
                The Skill Matching Engine compares what you teach with what other students want to learn.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => setAddSkillType('learn')} className="btn btn-primary btn-sm">
                  Add Learning Interest
                </button>
                <Link to="/explore" className="btn btn-secondary btn-sm">
                  Browse Catalog
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Recent Activity Feed */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recent Exchange Activity
            </h2>
            <Link to="/requests" className="btn btn-secondary btn-sm">
              View All Requests <ChevronRight size={15} />
            </Link>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {recentActivity.length > 0 ? (
              <div style={{ divideY: '1px solid var(--border-subtle)' }}>
                {recentActivity.map((act) => {
                  const isSender = act.sender?._id === user?._id;
                  const partner = isSender ? act.receiver : act.sender;

                  return (
                    <div
                      key={act._id}
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="avatar avatar-sm">
                          {partner?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {isSender ? (
                              <span>Sent exchange request to <strong>{partner?.name}</strong></span>
                            ) : (
                              <span>Received request from <strong>{partner?.name}</strong></span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Trading <strong>{act.offeredSkill}</strong> for <strong>{act.learningSkill}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          className={`badge ${
                            act.status === 'accepted'
                              ? 'badge-success'
                              : act.status === 'pending'
                              ? 'badge-warning'
                              : act.status === 'completed'
                              ? 'badge-primary'
                              : 'badge-neutral'
                          }`}
                        >
                          {act.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(act.updatedAt || act.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No recent activity yet. Propose your first skill swap on the Explore page!
              </div>
            )}
          </div>
        </section>

        {/* Modals */}
        {exchangeTarget && (
          <ExchangeModal
            receiver={exchangeTarget}
            isOpen={!!exchangeTarget}
            onClose={() => setExchangeTarget(null)}
            onSuccess={fetchDashboard}
          />
        )}

        {addSkillType && (
          <AddSkillModal
            type={addSkillType}
            isOpen={!!addSkillType}
            onClose={() => setAddSkillType(null)}
            onSuccess={async () => {
              await refreshUser();
              fetchDashboard();
            }}
          />
        )}

        {isEditProfileOpen && (
          <ProfileEditModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            onSuccess={() => {
              refreshUser();
              fetchDashboard();
            }}
          />
        )}

        <style>{`
          @media (min-width: 901px) {
            .dashboard-mobile-header { display: none !important; }
          }
        `}</style>
      </main>
    </div>
  );
};

export default DashboardPage;
