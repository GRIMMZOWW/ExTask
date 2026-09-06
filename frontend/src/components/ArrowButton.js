/*
 * ArrowButton — Originkit Arrow Reveal Button (copy-paste implementation)
 * Source pattern: originkit.dev Arrow Reveal Button
 *
 * A button where an arrow icon slides in from the left on hover,
 * creating a reveal interaction effect.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const ArrowButton = ({
  to,
  children,
  className = '',
  variant = 'primary', // 'primary' | 'secondary'
  onClick,
  style = {},
}) => {
  const baseClass = variant === 'primary' ? 'arrow-btn arrow-btn-primary' : 'arrow-btn arrow-btn-secondary';

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className}`} style={style}>
        <span className="arrow-btn-text">{children}</span>
        <span className="arrow-btn-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </Link>
    );
  }

  return (
    <button type="button" className={`${baseClass} ${className}`} onClick={onClick} style={style}>
      <span className="arrow-btn-text">{children}</span>
      <span className="arrow-btn-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </button>
  );
};

export default ArrowButton;
