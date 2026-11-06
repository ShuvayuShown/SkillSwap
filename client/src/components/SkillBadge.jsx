import React from 'react';

const levelColors = {
  Beginner: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  Intermediate: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Advanced: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
  Expert: { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' }
};

export const SkillBadge = ({ skill, showLevel = true, size = 'md' }) => {
  if (!skill) return null;
  const name = typeof skill === 'string' ? skill : skill.name;
  const level = skill.level || 'Intermediate';
  const colors = levelColors[level] || levelColors.Intermediate;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: '6px',
        fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
        fontWeight: 500,
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        lineHeight: 1.2
      }}
    >
      <span>{name}</span>
      {showLevel && (
        <span
          style={{
            fontSize: '0.7rem',
            opacity: 0.75,
            fontWeight: 600,
            paddingLeft: '4px',
            borderLeft: `1px solid ${colors.border}`
          }}
        >
          {level}
        </span>
      )}
    </span>
  );
};

export default SkillBadge;
