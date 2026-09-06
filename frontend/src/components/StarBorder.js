import React from 'react';

/**
 * StarBorder — React Bits component
 * Subtle glowing star border trail effect around CTA buttons or cards.
 */
const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = '#14b8a6',
  speed = '4s',
  children,
  style = {},
  innerStyle = {},
  ...props
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-md, 10px)',
        padding: '1.5px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        ...style,
      }}
      {...props}
    >
      <div
        className="star-border-beam"
        style={{
          position: 'absolute',
          inset: '-200%',
          background: `conic-gradient(from 0deg, transparent 0 340deg, ${color} 360deg)`,
          animation: `starRotate ${speed} linear infinite`,
          zIndex: 0,
        }}
      />
      <div
        className="star-border-inner"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'inherit',
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
