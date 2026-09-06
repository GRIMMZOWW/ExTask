import React, { useMemo } from 'react';

/**
 * AeroShards — React Bits component
 * Floating subtle geometric glass shards adding 3D ambient depth to tech sections.
 */
const AeroShards = ({
  count = 6,
  className = '',
  style = {},
}) => {
  const shards = useMemo(() => {
    const colors = [
      'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
      'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)',
      'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(45, 212, 191, 0.04) 100%)',
    ];
    const borders = [
      '1px solid rgba(45, 212, 191, 0.2)',
      '1px solid rgba(99, 102, 241, 0.2)',
      '1px solid rgba(255, 255, 255, 0.12)',
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 28 + (i * 16) % 48,
      left: `${8 + (i * 18) % 84}%`,
      top: `${12 + (i * 22) % 76}%`,
      duration: `${12 + (i * 2.5)}s`,
      delay: `${(i * 1.5)}s`,
      rotate: `${(i * 50) % 360}deg`,
      bg: colors[i % colors.length],
      border: borders[i % borders.length],
      borderRadius: i % 2 === 0 ? '8px' : '14px',
    }));
  }, [count]);

  return (
    <div
      className={`aero-shards-layer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      {shards.map((shard) => (
        <div
          key={shard.id}
          className="aero-shard-item"
          style={{
            position: 'absolute',
            left: shard.left,
            top: shard.top,
            width: `${shard.size}px`,
            height: `${shard.size}px`,
            border: shard.border,
            background: shard.bg,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: shard.borderRadius,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
            transform: `rotate(${shard.rotate})`,
            animation: `shardFloat ${shard.duration} ease-in-out ${shard.delay} infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default AeroShards;
