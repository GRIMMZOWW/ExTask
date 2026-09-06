import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  FiSearch,
  FiFileText,
  FiPlusCircle,
  FiGrid,
  FiBriefcase,
  FiUser,
  FiCompass,
  FiCornerDownLeft,
  FiDollarSign,
  FiArrowRight,
  FiX
} from 'react-icons/fi';

function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const user = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);

  // Fetch tasks when palette opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      API.get('/tasks/getall')
        .then(res => {
          setTasks(res.data || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape key listener when palette is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Navigation Items
  const navItems = useMemo(() => {
    const items = [
      { id: 'browse', title: 'Browse Tasks Feed', subtitle: 'Explore all available campus tasks', icon: FiCompass, path: '/browse', category: 'Navigation' },
      { id: 'post', title: 'Post a Coding Task', subtitle: 'Publish requirements and set escrow budget', icon: FiPlusCircle, path: '/post', category: 'Actions' },
    ];
    if (user) {
      if (user.role === 'ADMIN') {
        items.push({ id: 'admin', title: 'Admin Governance Dashboard', subtitle: 'Manage users, tasks and escrow', icon: FiGrid, path: '/admin', category: 'Navigation' });
      } else {
        items.push(
          { id: 'dashboard', title: 'Student Dashboard', subtitle: 'View workspace and metrics', icon: FiGrid, path: '/dashboard', category: 'Navigation' },
          { id: 'mytasks', title: 'My Tasks & Commitments', subtitle: 'Manage posted and accepted work', icon: FiBriefcase, path: '/my-tasks', category: 'Navigation' },
          { id: 'profile', title: 'Profile & Settings', subtitle: 'Manage account information', icon: FiUser, path: '/profile', category: 'Navigation' }
        );
      }
    } else {
      items.push(
        { id: 'login', title: 'Sign In to ExTask', subtitle: 'Access your student account', icon: FiUser, path: '/login', category: 'Navigation' },
        { id: 'register', title: 'Create Free Account', subtitle: 'Join the campus developer network', icon: FiPlusCircle, path: '/register', category: 'Navigation' }
      );
    }
    return items;
  }, [user]);

  // Filtered results
  const filteredNavItems = useMemo(() => {
    if (!query.trim()) return navItems;
    const q = query.toLowerCase();
    return navItems.filter(item =>
      item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  }, [navItems, query]);

  const filteredTasks = useMemo(() => {
    if (!query.trim()) return tasks.slice(0, 4);
    const q = query.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.deliveryType && t.deliveryType.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [tasks, query]);

  // Combine items into single navigable list
  const allItems = useMemo(() => {
    const list = [];
    filteredNavItems.forEach(item => list.push({ type: 'nav', data: item }));
    filteredTasks.forEach(task => list.push({ type: 'task', data: task }));
    return list;
  }, [filteredNavItems, filteredTasks]);

  // Handle item selection
  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    if (item.type === 'nav') {
      navigate(item.data.path);
    } else if (item.type === 'task') {
      navigate(`/task/${item.data.id}`);
    }
  };

  // Keyboard navigation up / down / enter
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-container" onClick={e => e.stopPropagation()}>
        {/* Search input bar */}
        <div className="palette-input-wrapper">
          <FiSearch className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Search tasks, jump to pages, or type a keyword..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />

          <div className="palette-input-actions">
            {query && (
              <button
                type="button"
                className="palette-clear-btn"
                onClick={() => setQuery('')}
                title="Clear input"
              >
                Clear
              </button>
            )}
            <kbd className="palette-esc-kbd">ESC</kbd>
            {/* Prominent Wrong / Close "X" button */}
            <button
              type="button"
              className="palette-close-btn"
              onClick={onClose}
              aria-label="Close search"
              title="Close (ESC)"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="palette-results">
          {filteredNavItems.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-heading">Navigation & Quick Actions</span>
              {filteredNavItems.map((item, idx) => {
                const globalIndex = idx;
                const isSelected = selectedIndex === globalIndex;
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`palette-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect({ type: 'nav', data: item })}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <div className="palette-item-left">
                      <div className="palette-icon-box">
                        <IconComponent size={15} />
                      </div>
                      <div className="palette-item-text">
                        <span className="palette-item-title">{item.title}</span>
                        <span className="palette-item-subtitle">{item.subtitle}</span>
                      </div>
                    </div>
                    <div className="palette-item-right">
                      <span className="palette-item-badge">{item.category}</span>
                      <FiCornerDownLeft className="palette-enter-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-heading">
                {query.trim() ? `Matching Tasks (${filteredTasks.length})` : 'Recent Open Tasks'}
              </span>
              {filteredTasks.map((task, idx) => {
                const globalIndex = filteredNavItems.length + idx;
                const isSelected = selectedIndex === globalIndex;
                return (
                  <div
                    key={task.id}
                    className={`palette-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect({ type: 'task', data: task })}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <div className="palette-item-left">
                      <div className="palette-icon-box task-icon">
                        <FiFileText size={15} />
                      </div>
                      <div className="palette-item-text">
                        <span className="palette-item-title">{task.title}</span>
                        <span className="palette-item-subtitle">
                          {task.deliveryType || 'Standard'} • Status: {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="palette-item-right">
                      <span className="palette-budget-pill">
                        <FiDollarSign size={11} /> {task.budget} INR
                      </span>
                      <FiArrowRight className="palette-enter-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {allItems.length === 0 && !loading && (
            <div className="palette-empty">
              <p>No results found for "{query}".</p>
              <span>Try searching for keywords like "React", "Python", "Dashboard", or "Post".</span>
            </div>
          )}

          {loading && (
            <div className="palette-loading">
              <span>Searching campus database...</span>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="palette-footer">
          <div className="palette-shortcut">
            <kbd>↑</kbd><kbd>↓</kbd> <span>to navigate</span>
          </div>
          <div className="palette-shortcut">
            <kbd>↵</kbd> <span>to select</span>
          </div>
          <div className="palette-shortcut">
            <kbd>esc</kbd> <span>to close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CommandPalette;
