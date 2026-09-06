import React, { useRef, useEffect, useState } from 'react';

/**
 * BrandMedia — Unified media system for ExTask
 *
 * Auth pages → static IMAGE backgrounds (login, register, forgot, otp, reset)
 * All other pages → looping VIDEO backgrounds
 *
 * Video flash fix: CSS opacity crossfade on src change — no key= remount.
 */

const MEDIA_MAP = {
  home:            { type: 'video', src: '/videos/hero-bg.mp4',      poster: '/media/hero-hero.jpg' },
  hero:            { type: 'video', src: '/videos/hero-bg.mp4',      poster: '/media/hero-hero.jpg' },
  browse:          { type: 'image', src: '/media/browse-hero.jpg' },
  detail:          { type: 'image', src: '/media/detail-hero.jpg' },
  post:            { type: 'image', src: '/media/post-hero.jpg' },
  dashboard:       { type: 'image', src: '/media/dashboard-hero.jpg' },
  tasks:           { type: 'image', src: '/media/tasks-hero.jpg' },
  admin:           { type: 'image', src: '/media/admin-hero.jpg' },
  profile:         { type: 'image', src: '/media/profile-hero.jpg' },
  // Auth pages → static images
  'auth-login':    { type: 'image', src: '/media/auth-login.jpg' },
  'auth-register': { type: 'image', src: '/media/auth-register.jpg' },
  'auth-forgot':   { type: 'image', src: '/media/auth-forgot.jpg' },
  'auth-otp':      { type: 'image', src: '/media/auth-otp.jpg' },
  'auth-reset':    { type: 'image', src: '/media/auth-reset.jpg' },
};


const BrandMedia = ({
  variant = 'home',
  className = '',
  badge = '',
  eyebrow = '',
  title = '',
  subtitle = '',
  videoSrc,
  posterSrc,
  overlayStyle = {},
  style = {},
  children
}) => {
  const config = MEDIA_MAP[variant] || { type: 'video', src: '/videos/hero-bg.mp4', poster: '/media/hero-hero.jpg' };
  const isImage = config.type === 'image';
  const effectiveSrc = videoSrc || config.src;
  const effectivePoster = posterSrc || config.poster || '';

  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const mountedRef = useRef(false);

  // Smooth crossfade on src change (no key= remount = no flash)
  useEffect(() => {
    if (isImage || !videoRef.current) return;
    const video = videoRef.current;

    if (!mountedRef.current) {
      // First mount: just play
      mountedRef.current = true;
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
      return;
    }

    // Subsequent src changes: fade out → swap → fade in
    setVideoOpacity(0);
    const t = setTimeout(() => {
      video.src = effectiveSrc;
      video.load();
      video.play().catch(() => {});
      setVideoOpacity(1);
    }, 220);

    return () => clearTimeout(t);
  }, [effectiveSrc, isImage]);

  return (
    <div className={`brand-media brand-media-${variant} ${className}`} style={style}>
      <div className="brand-media-wrapper">
        {isImage ? (
          <img
            src={effectiveSrc}
            alt=""
            className="brand-media-image"
            draggable={false}
          />
        ) : (
          <video
            ref={videoRef}
            className="brand-media-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={effectivePoster}
            style={{ transition: 'opacity 0.22s ease', opacity: videoOpacity }}
          >
            <source src={effectiveSrc} type="video/mp4" />
          </video>
        )}
        <div className={`brand-media-overlay overlay-${variant}`} style={overlayStyle} />
      </div>

      {(badge || eyebrow || title || subtitle || children) && (
        <div className={`brand-media-content content-${variant}`}>
          {badge && <span className="brand-media-badge">{badge}</span>}
          {eyebrow && <span className="brand-media-eyebrow">{eyebrow}</span>}
          {title && <h2 className="brand-media-title">{title}</h2>}
          {subtitle && <p className="brand-media-subtitle">{subtitle}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

export default BrandMedia;

