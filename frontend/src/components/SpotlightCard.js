/*
 * SpotlightCard — React Bits component (copy-paste implementation)
 * Source pattern: reactbits.dev/components/spotlight-card
 *
 * Tracks mouse position and creates a radial spotlight gradient that follows the cursor.
 */
import React, { useRef } from 'react';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(37, 99, 235, 0.08)',
  spotlightSize = 300,
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--spotlight-x', `-999px`);
    card.style.setProperty('--spotlight-y', `-999px`);
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        '--spotlight-color': spotlightColor,
        '--spotlight-size': `${spotlightSize}px`,
      }}
    >
      <div
        className="spotlight-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(
            var(--spotlight-size) circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px),
            var(--spotlight-color),
            transparent 80%
          )`,
          zIndex: 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
