import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  Award,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentCard from '../components/StudentCard';
import ExchangeModal from '../components/ExchangeModal';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [selectedStudentForSwap, setSelectedStudentForSwap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await userApi.getUsers({ limit: 3 });
        if (res.success && res.users) {
          setFeaturedStudents(res.users);
        }
      } catch (err) {
        console.error('Failed to load featured students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSwapClick = (student) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setSelectedStudentForSwap(student);
    }
  };

  const categories = [
    { name: 'Programming', count: 'Java, Python, C++', icon: '💻', color: '#eef2ff' },
    { name: 'Web Development', count: 'React, Node, HTML/CSS', icon: '🌐', color: '#ecfdf5' },
    { name: 'UI/UX Design', count: 'Figma, Wireframes, UX', icon: '🎨', color: '#fdf2f8' },
    { name: 'Artificial Intelligence', count: 'ML, Prompt Eng, Data', icon: '🤖', color: '#fffbeb' },
    { name: 'Video Editing', count: 'Premiere, After Effects', icon: '🎬', color: '#f5f3ff' },
    { name: 'Photography', count: 'Lightroom, Lighting', icon: '📷', color: '#f0fdf4' },
    { name: 'Communication', count: 'Public Speaking, Pitch', icon: '🎙️', color: '#eff6ff' },
    { name: 'Languages', count: 'Spanish, German, Japanese', icon: '🗣️', color: '#fef2f2' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '80px 0 60px 0',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(129, 140, 248, 0.15), rgba(255, 255, 255, 0))',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px',
              border: '1px solid var(--primary-border)'
            }}
          >
            <Sparkles size={16} />
            <span>Peer-to-Peer Knowledge Exchange</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              lineHeight: 1.15,
              marginBottom: '20px'
            }}
          >
            Your Skills Have Value. <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Share Them.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '680px',
              margin: '0 auto 36px auto'
            }}
          >
            Connect with students, exchange knowledge and learn new skills together.
            No money required. Just mutual learning.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <Link to="/explore" className="btn btn-primary btn-lg">
              Explore Skills <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              How It Works
            </a>
          </div>

          {/* Social Proof Stats Banner */}
          <div
            style={{
              marginTop: '56px',
              padding: '20px 32px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px'
            }}
          >
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free & Monetary-Free</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>14+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skill Categories</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Smart Match</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complementary Engine</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>5.0 ★</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Student Peer Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* How SkillSwap Works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
              How SkillSwap Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Trade your strengths for what you want to master in 3 simple steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px'
            }}
          >
            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>List What You Know & Want</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6' }}>
                Add the skills you can comfortably teach (like Java or Video Editing) and the skills you are eager to learn (like Photoshop or Figma).
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Discover Complementary Matches</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6' }}>
                Our rule-based recommendation algorithm instantly pairs you with students who want what you teach and can teach what you need.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '20px'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Swap Knowledge & Review</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6' }}>
                Accept exchange proposals, collaborate on projects, complete the exchange, and build your peer reputation with verified ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skill Categories */}
      <section id="categories" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Popular Skill Categories
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Browse by topic or find peers across top disciplines.
              </p>
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm">
              View All Categories <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px'
                }}
              >
                <div
                  style={{
                    fontSize: '1.8rem',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: cat.color,
                    borderRadius: '12px'
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {cat.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {cat.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Students Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Meet Students on SkillSwap
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Real learners from top colleges actively sharing and acquiring skills.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              Loading students...
            </div>
          ) : (
            <div className="grid-cards">
              {featuredStudents.map((st) => (
                <StudentCard
                  key={st._id}
                  student={st}
                  onSendRequest={handleSwapClick}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/explore" className="btn btn-primary">
              Discover All Students <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px'
                }}
              >
                <Award size={16} />
                Why SkillSwap?
              </div>
              <h2
                style={{
                  fontSize: '2.3rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  marginBottom: '20px'
                }}
              >
                Learning is better when it is mutual, practical, and accessible.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '28px' }}>
                Paid bootcamps and generic tutorials lack the accountability and feedback of real humans. SkillSwap gives you a genuine learning partner.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--success)" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Zero Financial Barriers</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Every transaction is skill-for-skill. You pay with your own knowledge, not credit cards.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--success)" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Active Learning by Teaching</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Explaining concepts to another student cements your own mastery better than any textbook.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--success)" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Cross-Campus Networking</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Collaborate with students from different universities, departments, and creative fields.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Swap Card Display */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '36px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                The Classic SkillSwap Experience
              </h3>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '14px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rahul (IIT Bombay)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Teaches: Java</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  Wants: Photoshop
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--primary)' }}>
                <ArrowLeftRight size={24} style={{ transform: 'rotate(90deg)' }} />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Priya (NID Ahmedabad)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Teaches: Photoshop</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  Wants: Java
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  color: '#065f46',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} />
                <span>Result: Mutual learning, zero cost, and 5-star peer reviews!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section
        style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            Ready to swap your first skill?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '32px' }}>
            Join hundreds of motivated students already teaching and learning on SkillSwap. Create your profile in under 2 minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              Get Started for Free
            </Link>
            <Link
              to="/explore"
              className="btn btn-lg"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.4)'
              }}
            >
              Browse Skills
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Exchange Modal */}
      {selectedStudentForSwap && (
        <ExchangeModal
          receiver={selectedStudentForSwap}
          isOpen={!!selectedStudentForSwap}
          onClose={() => setSelectedStudentForSwap(null)}
        />
      )}
    </div>
  );
};

export default LandingPage;
