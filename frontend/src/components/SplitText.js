/*
 * SplitText — React Bits component (copy-paste implementation)
 * Source pattern: reactbits.dev/text-animations/split-text
 * 
 * Lightweight implementation using IntersectionObserver instead of GSAP.
 * Splits text into individual words/chars and animates them in on viewport entry.
 */
import React, { useRef, useEffect, useState, useMemo } from 'react';

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 0.6,
  ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
  splitType = 'words', // 'chars' | 'words'
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign = 'center',
  tag: Tag = 'p',
  onAnimationComplete,
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  const pieces = useMemo(() => {
    if (splitType === 'chars') return text.split('');
    return text.split(/(\s+)/);
  }, [text, splitType]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          observer.disconnect();
          if (onAnimationComplete) {
            const totalDelay = pieces.length * delay + duration * 1000;
            setTimeout(onAnimationComplete, totalDelay);
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, pieces.length, threshold, onAnimationComplete]);

  return (
    <Tag
      ref={containerRef}
      className={`split-text-container ${className}`}
      style={{ textAlign, display: 'flex', flexWrap: 'wrap', justifyContent: textAlign === 'center' ? 'center' : 'flex-start', gap: '0' }}
    >
      {pieces.map((piece, i) => {
        const isSpace = /^\s+$/.test(piece);
        if (isSpace) {
          return <span key={`space-${i}`} style={{ width: '0.3em' }}>&nbsp;</span>;
        }
        return (
          <span
            key={`${piece}-${i}`}
            className="split-text-piece"
            style={{
              display: 'inline-block',
              opacity: isVisible ? to.opacity : from.opacity,
              transform: isVisible
                ? `translateY(${to.y || 0}px)`
                : `translateY(${from.y || 40}px)`,
              transition: `opacity ${duration}s ${ease} ${i * (delay / 1000)}s, transform ${duration}s ${ease} ${i * (delay / 1000)}s`,
              willChange: 'transform, opacity',
            }}
          >
            {piece}
          </span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
