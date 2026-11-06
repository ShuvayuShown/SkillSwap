import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, Github, Linkedin, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        padding: '56px 0 32px 0',
        marginTop: '64px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ArrowLeftRight size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Skill<span style={{ color: 'var(--primary)' }}>Swap</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Learn Something New. Teach What You Know. The student-first peer-to-peer knowledge exchange network.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Shield size={16} color="var(--success)" />
              100% Free & Peer-to-Peer
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/explore" style={{ color: 'var(--text-secondary)' }}>
                  Explore Students & Skills
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)' }}>
                  Join Community
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>
                  Sign In to Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
              Popular Skills
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/explore?category=Programming" style={{ color: 'var(--text-secondary)' }}>
                  Java & Python
                </Link>
              </li>
              <li>
                <Link to="/explore?category=UI/UX Design" style={{ color: 'var(--text-secondary)' }}>
                  Figma & UI/UX
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Web Development" style={{ color: 'var(--text-secondary)' }}>
                  React & Node.js
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Graphic Design" style={{ color: 'var(--text-secondary)' }}>
                  Photoshop & Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer / Project Credits */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
              Developer
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Built with precision by <strong>Shuvayu Shown</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              Full-Stack Web Application Frameworks Project
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
              <a
                href="https://github.com/ShuvayuShown"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Github size={15} /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>© {new Date().getFullYear()} SkillSwap Inc. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Designed & Engineered with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Student Learning
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
