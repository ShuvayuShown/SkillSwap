import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Menu,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import AddSkillModal from '../components/AddSkillModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { skillApi } from '../services/api';

export const ManageSkillsPage = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null); // { type: 'teach'|'learn', initialSkill: null }
  const [deletingId, setDeletingId] = useState(null);

  const teachSkills = user?.skillsToTeach || [];
  const learnSkills = user?.skillsToLearn || [];

  const handleDeleteTeach = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your teaching skills?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await skillApi.deleteTeachingSkill(id);
      showToast('success', `Removed "${name}" from teaching skills.`);
      await refreshUser();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLearn = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your learning interests?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await skillApi.deleteLearningSkill(id);
      showToast('success', `Removed "${name}" from learning interests.`);
      await refreshUser();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

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

        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Manage Your Skills
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Curate what you can share with peers and what you want to master in return.
          </p>
        </div>

        {/* Section 1: Skills I Can Teach */}
        <section style={{ marginBottom: '48px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Skills I Can Teach</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {teachSkills.length} skills listed for peer exchanges
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalConfig({ type: 'teach', initialSkill: null })}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add Teaching Skill
            </button>
          </div>

          {teachSkills.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '18px'
              }}
            >
              {teachSkills.map((s) => (
                <div
                  key={s._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {s.name}
                      </h3>
                      <SkillBadge skill={s} size="sm" />
                    </div>

                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                    >
                      {s.category}
                    </div>

                    {s.description ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {s.description}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                        No extra description added.
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <button
                      onClick={() => setModalConfig({ type: 'teach', initialSkill: s })}
                      className="btn btn-secondary btn-sm"
                      title="Edit Skill"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeach(s._id, s.name)}
                      disabled={deletingId === s._id}
                      className="btn btn-danger btn-sm"
                      title="Delete Skill"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 24px',
                borderStyle: 'dashed'
              }}
            >
              <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>You haven't added any teaching skills yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '18px' }}>
                Listing your skills allows students to find you and initiate exchanges.
              </p>
              <button
                onClick={() => setModalConfig({ type: 'teach', initialSkill: null })}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} /> Add Your First Skill
              </button>
            </div>
          )}
        </section>

        {/* Section 2: Skills I Want to Learn */}
        <section>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Skills I Want to Learn</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {learnSkills.length} learning goals powering recommendations
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalConfig({ type: 'learn', initialSkill: null })}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
            >
              <Plus size={16} /> Add Learning Goal
            </button>
          </div>

          {learnSkills.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '18px'
              }}
            >
              {learnSkills.map((s) => (
                <div
                  key={s._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {s.name}
                      </h3>
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

                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--secondary)',
                        backgroundColor: 'var(--secondary-light)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                    >
                      {s.category}
                    </div>

                    {s.description ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {s.description}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
                        No specific sub-topics entered.
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <button
                      onClick={() => setModalConfig({ type: 'learn', initialSkill: s })}
                      className="btn btn-secondary btn-sm"
                      title="Edit Goal"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLearn(s._id, s.name)}
                      disabled={deletingId === s._id}
                      className="btn btn-danger btn-sm"
                      title="Delete Goal"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 24px',
                borderStyle: 'dashed'
              }}
            >
              <BookOpen size={36} color="var(--secondary)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No learning goals specified</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '18px' }}>
                Tell us what you want to learn so we can match you with qualified peers.
              </p>
              <button
                onClick={() => setModalConfig({ type: 'learn', initialSkill: null })}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={16} /> Add a Learning Target
              </button>
            </div>
          )}
        </section>

        {/* Modal for Adding or Editing a Skill */}
        {modalConfig && (
          <AddSkillModal
            type={modalConfig.type}
            initialSkill={modalConfig.initialSkill}
            isOpen={!!modalConfig}
            onClose={() => setModalConfig(null)}
            onSuccess={refreshUser}
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

export default ManageSkillsPage;
