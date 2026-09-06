import React from 'react';

/**
 * StarBorder — React Bits component
 * Vibrant glowing star border trail effect around CTA buttons and cards.
 */
const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = '#00e5ff',
  glowColor = '#2dd4bf',
  speed = '3.5s',
  thickness = '2px',
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
        borderRadius: 'var(--radius-md, 12px)',
        padding: thickness,
        background: 'transparent',
        border: 'none',
        textDecoration: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {/* Outer ambient glow beam */}
      <div
        className="star-border-glow"
        style={{
          position: 'absolute',
          inset: '-200%',
          background: `conic-gradient(from 0deg, transparent 0 260deg, ${glowColor}44 310deg, ${color} 360deg)`,
          animation: `starRotate ${speed} linear infinite`,
          filter: `drop-shadow(0 0 8px ${color})`,
          zIndex: 0,
        }}
      />
      
      {/* Sharp core beam */}
      <div
        className="star-border-beam"
        style={{
          position: 'absolute',
          inset: '-200%',
          background: `conic-gradient(from 0deg, transparent 0 270deg, ${glowColor}66 320deg, ${color} 360deg)`,
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
          background: 'inherit',
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
