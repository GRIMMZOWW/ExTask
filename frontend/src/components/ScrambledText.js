import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrambledText — React Bits component
 * Decrypted text scrambler animation on view/hover with clean easing.
 */
const ScrambledText = ({
  text = '',
  speed = 40,
  maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~',
  className = '',
  style = {},
  tag: Tag = 'span',
  animateOn = 'view', // 'view' | 'hover' | 'both'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const startAnimation = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }

      iteration += 1 / (maxIterations / text.length || 1);
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'hover') {
      setDisplayText(text);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            startAnimation();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [text, speed, maxIterations, characters, animateOn]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOn === 'hover' || animateOn === 'both') {
      startAnimation();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Tag
      ref={containerRef}
      className={`scrambled-text ${className}`}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </Tag>
  );
};

export default ScrambledText;
