import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiBriefcase,
  FiGrid,
  FiSettings,
  FiSearch
} from 'react-icons/fi';
import Logo from './Logo';
import CommandPalette from './CommandPalette';
import NotificationPopover from './NotificationPopover';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener to toggle Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Scroll listener for transparent-to-frosted glass transition on landing page
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 70);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync user state from localStorage (updates dynamically when profile or login changes)
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    loadUser();
    
    window.addEventListener('storage', loadUser);
    window.addEventListener('userProfileUpdated', loadUser);
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userProfileUpdated', loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/users/logout');
    } catch (err) {
      console.warn("Backend logout notification finished with:", err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      setMenuOpen(false);
      setDropdownOpen(false);
      navigate('/login');
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  // Derive initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Transparent ONLY for Home page hero before scrolling down
  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !scrolled && !menuOpen;

  return (
    <>
      <nav className={`navbar ${showTransparent ? 'navbar-transparent' : 'navbar-scrolled'}`}>
        <div className="nav-inner">

          {/* Dynamic Logo Routing */}
          <Link to={user ? (user.role === 'ADMIN' ? '/admin' : '/') : '/'} className="nav-brand" onClick={closeMenu}>
            <Logo size={25} showText={true} variant={showTransparent ? 'light' : 'dark'} />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu">
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          {/* Navigation / Actions Bar */}
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {user ? (
              <>
                {user.role === 'ADMIN' ? (
                  // ADMIN NAVIGATION
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={closeMenu}>Admin Dashboard</Link>
                ) : (
                  // STUDENT NAVIGATION
                  <>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>Dashboard</Link>
                    <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`} onClick={closeMenu}>Browse Tasks</Link>
                    <Link to="/post" className={`nav-link ${isActive('/post') ? 'active' : ''}`} onClick={closeMenu}>Post Task</Link>
                    <Link to="/my-tasks" className={`nav-link ${isActive('/my-tasks') ? 'active' : ''}`} onClick={closeMenu}>My Tasks</Link>
                  </>
                )}
                
                <span className="nav-separator-line" />

                {/* Quick Command Palette Trigger */}
                <button
                  type="button"
                  className={`nav-cmd-trigger ${showTransparent ? 'light' : ''}`}
                  onClick={() => setCmdOpen(true)}
                  title="Quick Search & Actions (Ctrl + K)"
                >
                  <FiSearch size={13} />
                  <span className="nav-cmd-text">Search...</span>
                  <kbd className="nav-cmd-kbd">Ctrl K</kbd>
                </button>

                {/* Notification Bell Dropdown */}
                <NotificationPopover variant={showTransparent ? 'light' : 'dark'} />

                {/* Desktop Account Control */}
                <div className="nav-user-container" ref={dropdownRef}>
                  <button 
                    className="account-surface" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="account-avatar-circle">{getInitials(user.name)}</span>
                    <span className="nav-username">{user.name}</span>
                    <FiChevronDown className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} size={14} />
                  </button>

                  {/* Account Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="account-dropdown show">
                      <div className="dropdown-user-info">
                        <span className="dropdown-avatar-large">{getInitials(user.name)}</span>
                        <div className="dropdown-user-meta">
                          <span className="dropdown-name">{user.name}</span>
                          <span className="dropdown-role">
                            {user.role === 'ADMIN' ? 'Administrator' : 'Student Account'}
                          </span>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      
                      {user.role === 'ADMIN' ? (
                        <>
                          <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <FiGrid size={14} /> Admin Dashboard
                          </Link>
                          <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <FiSettings size={14} /> Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <FiUser size={14} /> Profile
                          </Link>
                          <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <FiGrid size={14} /> Dashboard
                          </Link>
                          <Link to="/my-tasks" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <FiBriefcase size={14} /> My Tasks
                          </Link>
                        </>
                      )}
                      
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <FiLogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="nav-auth">
                {/* Command Palette for guests */}
                <button
                  type="button"
                  className={`nav-cmd-trigger ${showTransparent ? 'light' : ''}`}
                  onClick={() => setCmdOpen(true)}
                  title="Quick Search & Actions (Ctrl + K)"
                >
                  <FiSearch size={13} />
                  <span className="nav-cmd-text">Search...</span>
                  <kbd className="nav-cmd-kbd">Ctrl K</kbd>
                </button>

                <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`} onClick={closeMenu}>Browse Tasks</Link>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`} onClick={closeMenu}>Log In</Link>
                <Link to="/register" className="btn-hero-nav btn-sm" onClick={closeMenu}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Global Command Palette Dialog */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}

export default Navbar;
