import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Menu,
  MessageSquare,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestApi } from '../services/api';

export const RequestsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'completed'

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [completedExchanges, setCompletedExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const [rec, sent, comp] = await Promise.all([
        requestApi.getReceived(),
        requestApi.getSent(),
        requestApi.getCompleted()
      ]);

      if (rec.success) setReceivedRequests(rec.requests);
      if (sent.success) setSentRequests(sent.requests);
      if (comp.success) setCompletedExchanges(comp.exchanges);
    } catch (err) {
      console.error('Failed to load requests:', err);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleAccept = async (id) => {
    setActionLoadingId(id);
    try {
      await requestApi.accept(id);
      showToast('success', 'Exchange request accepted! Collaboration unlocked.');
      await fetchAllRequests();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this skill swap proposal?')) return;
    setActionLoadingId(id);
    try {
      await requestApi.reject(id);
      showToast('info', 'Request declined.');
      await fetchAllRequests();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your pending request?')) return;
    setActionLoadingId(id);
    try {
      await requestApi.cancel(id);
      showToast('info', 'Request cancelled.');
      await fetchAllRequests();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Have you completed the skill exchange sessions with your peer?')) return;
    setActionLoadingId(id);
    try {
      await requestApi.complete(id);
      showToast('success', 'Exchange marked as completed! You can now rate and review your peer.');
      await fetchAllRequests();
      setActiveTab('completed');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openReviewModal = (exchange) => {
    const isSender = exchange.sender?._id === user?._id;
    const partner = isSender ? exchange.receiver : exchange.sender;
    setReviewTarget({
      _id: exchange._id,
      partnerName: partner?.name || 'Peer'
    });
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
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Exchange Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Manage inbound proposals, track active swaps, and leave peer reviews.
          </p>
        </div>

        {/* Three Tabs: Received, Sent, Completed */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '28px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}
        >
          <button
            onClick={() => setActiveTab('received')}
            style={{
              padding: '12px 18px',
              fontSize: '0.925rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: activeTab === 'received' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'received' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            <Inbox size={18} />
            <span>Received Requests</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'received' ? 'var(--primary-light)' : 'var(--bg-subtle)',
                color: activeTab === 'received' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {receivedRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            style={{
              padding: '12px 18px',
              fontSize: '0.925rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: activeTab === 'sent' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'sent' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            <Send size={18} />
            <span>Sent Requests</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'sent' ? 'var(--primary-light)' : 'var(--bg-subtle)',
                color: activeTab === 'sent' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {sentRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '12px 18px',
              fontSize: '0.925rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: activeTab === 'completed' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'completed' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            <CheckCircle2 size={18} />
            <span>Completed Exchanges</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'completed' ? 'var(--primary-light)' : 'var(--bg-subtle)',
                color: activeTab === 'completed' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {completedExchanges.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Received Requests */}
        {activeTab === 'received' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div key={req._id} className="card" style={{ padding: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="avatar avatar-md">
                        {req.sender?.profileImage ? (
                          <img
                            src={req.sender.profileImage}
                            alt={req.sender.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          req.sender?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {req.sender?.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {req.sender?.college} • Sent {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        req.status === 'pending'
                          ? 'badge-warning'
                          : req.status === 'accepted'
                          ? 'badge-success'
                          : req.status === 'completed'
                          ? 'badge-primary'
                          : 'badge-danger'
                      }`}
                    >
                      Status: {req.status}
                    </span>
                  </div>

                  {/* Skills Exchanged Card */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      backgroundColor: 'var(--bg-page)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        Wants to Learn From You:
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                        {req.learningSkill}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                        Offers to Teach You:
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                        {req.offeredSkill}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: '18px',
                        padding: '10px 14px',
                        backgroundColor: '#ffffff',
                        borderLeft: '3px solid var(--primary-border)',
                        borderRadius: '0 6px 6px 0'
                      }}
                    >
                      "{req.message}"
                    </div>
                  )}

                  {/* Actions for Receiver */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={actionLoadingId === req._id}
                          className="btn btn-secondary btn-sm"
                        >
                          <XCircle size={15} /> Decline
                        </button>
                        <button
                          onClick={() => handleAccept(req._id)}
                          disabled={actionLoadingId === req._id}
                          className="btn btn-success btn-sm"
                        >
                          <CheckCircle2 size={15} /> Accept Request
                        </button>
                      </>
                    )}

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleComplete(req._id)}
                        disabled={actionLoadingId === req._id}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Mark Exchange Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                <Inbox size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h3>No incoming exchange proposals yet</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                  Keep your teaching skills updated so other students can discover you!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sent Requests */}
        {activeTab === 'sent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <div key={req._id} className="card" style={{ padding: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="avatar avatar-md">
                        {req.receiver?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Sent to {req.receiver?.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {req.receiver?.college} • Sent on {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        req.status === 'pending'
                          ? 'badge-warning'
                          : req.status === 'accepted'
                          ? 'badge-success'
                          : req.status === 'completed'
                          ? 'badge-primary'
                          : 'badge-neutral'
                      }`}
                    >
                      Status: {req.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      backgroundColor: 'var(--bg-page)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        Skill You Want to Learn:
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                        {req.learningSkill}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                        Skill You Offered:
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                        {req.offeredSkill}
                      </div>
                    </div>
                  </div>

                  {req.message && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: '18px'
                      }}
                    >
                      "{req.message}"
                    </div>
                  )}

                  {/* Actions for Sender */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(req._id)}
                        disabled={actionLoadingId === req._id}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel Pending Request
                      </button>
                    )}

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleComplete(req._id)}
                        disabled={actionLoadingId === req._id}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Mark Exchange Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                <Send size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h3>You haven't sent any proposals yet</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                  Explore student profiles to discover people who know what you want to learn!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completed Exchanges */}
        {activeTab === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {completedExchanges.length > 0 ? (
              completedExchanges.map((ex) => {
                const isSender = ex.sender?._id === user?._id;
                const partner = isSender ? ex.receiver : ex.sender;

                return (
                  <div key={ex._id} className="card" style={{ padding: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="avatar avatar-md">
                          {partner?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Exchange with {partner?.name}
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {partner?.college} • Completed on {new Date(ex.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span className="badge badge-success">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        backgroundColor: 'var(--bg-page)',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '18px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Learned:
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                          {isSender ? ex.learningSkill : ex.offeredSkill}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Taught:
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                          {isSender ? ex.offeredSkill : ex.learningSkill}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openReviewModal(ex)}
                        className="btn btn-primary btn-sm"
                      >
                        <Star size={15} /> Rate & Review {partner?.name?.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h3>No completed exchanges yet</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                  Once an accepted exchange is marked complete, you can write a review here!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Review Modal */}
        {reviewTarget && (
          <ReviewModal
            exchange={reviewTarget}
            isOpen={!!reviewTarget}
            onClose={() => setReviewTarget(null)}
            onSuccess={fetchAllRequests}
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

export default RequestsPage;
