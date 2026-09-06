import React, { useRef, useEffect, useState } from 'react';

/**
 * MorphSlider — React Bits component
 * Smooth sliding morph pill indicator for tabs and filter bars.
 */
const MorphSlider = ({
  options = [],
  activeValue,
  onChange,
  className = '',
  style = {},
}) => {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-value="${activeValue}"]`);
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
        opacity: 1,
      });
    }
  }, [activeValue, options]);

  return (
    <div
      ref={containerRef}
      className={`morph-slider-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-alt, #f1f5f9)',
        padding: '4px',
        borderRadius: '100px',
        border: '1px solid var(--border, #e2e8f0)',
        ...style,
      }}
    >
      {/* Morphing Sliding Pill */}
      <div
        className="morph-slider-pill"
        style={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          background: 'var(--surface, #ffffff)',
          borderRadius: '100px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const icon = typeof opt === 'object' ? opt.icon : null;
        const count = typeof opt === 'object' && opt.count !== undefined ? opt.count : null;
        const isSelected = activeValue === val;

        return (
          <button
            key={val}
            type="button"
            data-value={val}
            onClick={() => onChange && onChange(val)}
            className={`morph-slider-item ${isSelected ? 'selected' : ''}`}
            style={{
              position: 'relative',
              zIndex: 2,
              background: 'transparent',
              border: 'none',
              padding: '6px 16px',
              fontSize: '0.82rem',
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? 'var(--navy, #0f172a)' : 'var(--text-secondary, #64748b)',
              cursor: 'pointer',
              borderRadius: '100px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            {icon}
            <span>{label}</span>
            {count !== null && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--teal-bg, #ccfbf1)' : 'var(--border, #e2e8f0)',
                  color: isSelected ? 'var(--teal-dark, #0f766e)' : 'var(--text-muted, #94a3b8)',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MorphSlider;
