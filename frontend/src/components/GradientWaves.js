import React from 'react';

/**
 * GradientWaves — React Bits component
 * Ambient, subtle, non-distracting gradient waves for cards and background panels.
 */
const GradientWaves = ({
  className = '',
  opacity = 0.35,
  speed = '12s',
  style = {},
}) => {
  return (
    <div
      className={`gradient-waves-wrapper ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: opacity,
        zIndex: 0,
        ...style,
      }}
    >
      <div
        className="gradient-wave wave-1"
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(ellipse at 30% 40%, rgba(20, 184, 166, 0.18) 0%, transparent 60%)',
          animation: `waveRotate ${speed} ease-in-out infinite alternate`,
        }}
      />
      <div
        className="gradient-wave wave-2"
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-40%',
          width: '180%',
          height: '180%',
          background: 'radial-gradient(ellipse at 70% 60%, rgba(56, 189, 248, 0.12) 0%, transparent 55%)',
          animation: `waveRotate 16s ease-in-out infinite alternate-reverse`,
        }}
      />
    </div>
  );
};

export default GradientWaves;
