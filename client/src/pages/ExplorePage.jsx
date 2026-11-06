import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, RefreshCw, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentCard from '../components/StudentCard';
import ExchangeModal from '../components/ExchangeModal';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
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

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [page, setPage] = useState(1);

  // Exchange Modal target
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        level: level !== 'All' ? level : undefined
      };

      const res = await userApi.getUsers(params);
      if (res.success) {
        setStudents(res.users);
        setTotalCount(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [category, level, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleSwapClick = (student) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setSelectedStudent(student);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 0 60px 0' }}>
        <div className="container">
          {/* Header Title */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Explore Student Skills
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '6px' }}>
              Find peer students across top universities ready to exchange knowledge.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  alignItems: 'center'
                }}
              >
                {/* Search query input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Search by skill, student, or college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
                  />
                </div>

                {/* Category dropdown */}
                <div>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        Category: {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Proficiency Level dropdown */}
                <div>
                  <select
                    className="form-select"
                    value={level}
                    onChange={(e) => {
                      setLevel(e.target.value);
                      setPage(1);
                    }}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level: {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setCategory('All');
                      setLevel('All');
                      setPage(1);
                    }}
                    className="btn btn-secondary"
                    title="Reset Filters"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{students.length}</strong> of <strong>{totalCount}</strong> students
            </div>
          </div>

          {/* Student Cards Grid */}
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--text-muted)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid var(--border-subtle)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 16px auto'
                }}
              />
              Searching student profiles...
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="grid-cards">
                {students.map((st) => (
                  <StudentCard
                    key={st._id}
                    student={st}
                    onSendRequest={handleSwapClick}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '44px'
                  }}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 24px'
              }}
            >
              <Layers size={40} color="var(--text-light)" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No student profiles matched your filter.</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                Try loosening your search keywords or switching to "All" categories.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setLevel('All');
                  setPage(1);
                }}
                className="btn btn-primary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedStudent && (
        <ExchangeModal
          receiver={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
