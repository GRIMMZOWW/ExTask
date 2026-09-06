import React from 'react';

const Logo = ({ size = 28, showText = true, showSubtitle = false, className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';
  
  // Sizing calculations for badge
  const badgeSize = size > 24 ? 32 : 26;
  const badgeFontSize = size > 24 ? '0.85rem' : '0.72rem';

  const navyColor = isLight ? '#ffffff' : '#0f172a';
  const tealColor = isLight ? '#2dd4bf' : '#0d9488';

  return (
    <span 
      className={`header__logo ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '10px', 
        textDecoration: 'none',
        background: 'transparent',
        boxShadow: 'none',
        padding: 0
      }}
    >
      {/* SnackYatra-Style Rounded-Square Badge */}
      <span
        className={`header__logo-badge ${isLight ? 'badge--light' : 'badge--dark'}`}
        style={{
          width: `${badgeSize}px`,
          height: `${badgeSize}px`,
          borderRadius: '7px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: badgeFontSize,
          letterSpacing: '0.5px',
          flexShrink: 0,
          userSelect: 'none',
          color: '#ffffff',
          background: isLight ? 'rgba(20, 184, 166, 0.35)' : '#0d9488',
          border: isLight ? '1px solid rgba(45, 212, 191, 0.7)' : '1px solid rgba(13, 148, 136, 0.9)',
          transition: 'all 0.3s ease'
        }}
        aria-hidden="true"
      >
        ET
      </span>

      {showText && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            className="header__logo-text"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: size > 24 ? '1.2rem' : '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              userSelect: 'none',
              transition: 'color 0.3s ease'
            }}
          >
            <span style={{ color: navyColor, transition: 'color 0.3s ease' }}>EX</span>
            <span style={{ color: tealColor, transition: 'color 0.3s ease' }}>TASK</span>
          </span>
          {showSubtitle && (
            <span
              style={{
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '1.4px',
                color: isLight ? 'rgba(255, 255, 255, 0.75)' : '#64748b',
                textTransform: 'uppercase',
                marginTop: '2px',
                lineHeight: 1,
                fontFamily: 'var(--font)'
              }}
            >
              CAMPUS TASK EXCHANGE
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export default Logo;

