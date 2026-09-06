import React from 'react';

/**
 * Aurora — React Bits Component
 * High-vibrancy, fluid Northern Lights glowing aurora background.
 * Creates an energetic, colorful wave pattern with multi-layered drifting gradients.
 */
const Aurora = ({
  colorStops = ['#00f2fe', '#6366f1', '#a855f7', '#2dd4bf', '#3b82f6'],
  speed = 1.2,
  opacity = 0.75,
  blendMode = 'screen',
  className = '',
  style = {},
  children,
}) => {
  return (
    <div
      className={`aurora-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 100% 70% at 50% 100%, #0c1527 0%, #070d18 100%)',
        ...style,
      }}
    >
      {/* Top Horizon Glow Line */}
      <div
        className="aurora-top-glow"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.8), rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)',
          boxShadow: '0 0 25px 4px rgba(45, 212, 191, 0.6), 0 0 50px 8px rgba(99, 102, 241, 0.4)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Dynamic Multi-Layer Animated Aurora Mesh */}
      <div
        className="aurora-mesh-container"
        style={{
          position: 'absolute',
          inset: '-20%',
          width: '140%',
          height: '140%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: opacity,
          mixBlendMode: blendMode,
          filter: 'blur(40px)',
          transform: 'translateZ(0)',
        }}
      >
        {/* Wave Layer 1: Electric Cyan & Teal */}
        <div
          className="aurora-beam aurora-beam-1"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 70% 50% at 20% 30%, ${colorStops[0]} 0%, ${colorStops[3]} 35%, transparent 70%)`,
            animation: `auroraDrift1 ${12 / speed}s ease-in-out infinite alternate`,
          }}
        />

        {/* Wave Layer 2: Vivid Indigo & Violet */}
        <div
          className="aurora-beam aurora-beam-2"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 65% 55% at 80% 60%, ${colorStops[1]} 0%, ${colorStops[2]} 40%, transparent 70%)`,
            animation: `auroraDrift2 ${15 / speed}s ease-in-out infinite alternate`,
          }}
        />

        {/* Wave Layer 3: Neon Purple & Electric Blue */}
        <div
          className="aurora-beam aurora-beam-3"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 60% 45% at 50% 25%, ${colorStops[2]} 0%, ${colorStops[4]} 40%, transparent 65%)`,
            animation: `auroraDrift3 ${14 / speed}s ease-in-out infinite alternate`,
          }}
        />

        {/* Wave Layer 4: Deep Teal & Emerald Surge */}
        <div
          className="aurora-beam aurora-beam-4"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 75% 55% at 45% 85%, ${colorStops[3]} 0%, ${colorStops[0]} 40%, transparent 70%)`,
            animation: `auroraDrift4 ${18 / speed}s ease-in-out infinite alternate`,
          }}
        />
      </div>

      {/* Content Container (Layered on top of Aurora) */}
      <div className="aurora-content" style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
};

export default Aurora;
