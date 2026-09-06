import React, { useMemo } from 'react';

/**
 * AeroShards — React Bits component
 * Floating subtle geometric glass shards adding depth to tech sections.
 */
const AeroShards = ({
  count = 6,
  className = '',
  style = {},
}) => {
  const shards = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 24 + (i * 14) % 40,
      left: `${10 + (i * 17) % 80}%`,
      top: `${15 + (i * 23) % 70}%`,
      duration: `${14 + (i * 3)}s`,
      delay: `${(i * 1.8)}s`,
      rotate: `${(i * 45) % 360}deg`,
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(20, 184, 166, 0.03) 100%)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
            transform: `rotate(${shard.rotate})`,
            animation: `shardFloat ${shard.duration} ease-in-out ${shard.delay} infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default AeroShards;
