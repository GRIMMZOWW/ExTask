/*
 * FadeContent — React Bits component (copy-paste implementation)
 * Source pattern: reactbits.dev/animations/fade-content
 *
 * Fades children in when they enter the viewport using IntersectionObserver.
 * Lightweight alternative to the GSAP ScrollTrigger version.
 */
import React, { useRef, useEffect, useState } from 'react';

const FadeContent = ({
  children,
  blur = false,
  duration = 800,
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  distance = 24,
  className = '',
  style = {},
  ...props
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (direction === 'up') return `translateY(${distance}px)`;
    if (direction === 'down') return `translateY(-${distance}px)`;
    if (direction === 'left') return `translateX(${distance}px)`;
    if (direction === 'right') return `translateX(-${distance}px)`;
    return 'none';
  };

  const durationSec = duration / 1000;

  return (
    <div
      ref={ref}
      className={`fade-content ${className}`}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        transform: isVisible ? 'none' : getTransform(),
        filter: blur && !isVisible ? 'blur(4px)' : 'none',
        transition: `opacity ${durationSec}s cubic-bezier(0.16, 1, 0.3, 1) ${delay / 1000}s, transform ${durationSec}s cubic-bezier(0.16, 1, 0.3, 1) ${delay / 1000}s, filter ${durationSec}s ease ${delay / 1000}s`,
        willChange: 'opacity, transform, filter',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeContent;
