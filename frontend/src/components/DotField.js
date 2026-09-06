import React, { useRef, useEffect } from 'react';

/**
 * DotField / CursorGrid — React Bits component
 * Subtle ambient interactive dot field responding cleanly to cursor proximity.
 * Supports both localized containers and global fixed viewport background.
 */
const DotField = ({
  className = '',
  gap = 32,
  baseRadius = 1.0,
  maxRadius = 2.4,
  dotColor = 'rgba(148, 163, 184, 0.16)',
  glowColor = 'rgba(45, 212, 191, 0.55)',
  proximity = 95,
  isGlobal = false,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      if (isGlobal) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
      } else {
        if (!canvas.parentElement) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (isGlobal) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      } else {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    if (isGlobal) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      const parent = canvas.parentElement;
      if (parent) {
        parent.addEventListener('mousemove', handleMouseMove, { passive: true });
        parent.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let r = baseRadius;
          let color = dotColor;

          if (dist < proximity) {
            const factor = 1 - dist / proximity;
            r = baseRadius + (maxRadius - baseRadius) * factor;
            color = glowColor;
          }

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (isGlobal) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        const parent = canvas.parentElement;
        if (parent) {
          parent.removeEventListener('mousemove', handleMouseMove);
          parent.removeEventListener('mouseleave', handleMouseLeave);
        }
      }
    };
  }, [gap, baseRadius, maxRadius, dotColor, glowColor, proximity, isGlobal]);

  return (
    <canvas
      ref={canvasRef}
      className={`dot-field-canvas ${isGlobal ? 'dot-field-global' : ''} ${className}`}
      style={{
        position: isGlobal ? 'fixed' : 'absolute',
        inset: 0,
        width: isGlobal ? '100vw' : '100%',
        height: isGlobal ? '100vh' : '100%',
        pointerEvents: 'none',
        zIndex: isGlobal ? -1 : 0,
        ...style,
      }}
    />
  );
};

export default DotField;
