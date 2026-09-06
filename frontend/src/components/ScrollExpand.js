import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollExpand — React Bits component
 * Smoothly expands container width/scale as it scrolls into viewport.
 */
const ScrollExpand = ({
  children,
  className = '',
  initialScale = 0.96,
  targetScale = 1,
  duration = '0.6s',
  style = {},
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-container ${className}`}
      style={{
        transform: isVisible ? `scale(${targetScale})` : `scale(${initialScale})`,
        opacity: isVisible ? 1 : 0.6,
        transition: `transform ${duration} cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration} cubic-bezier(0.16, 1, 0.3, 1)`,
        transformOrigin: 'center center',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollExpand;
