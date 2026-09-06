import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheckCircle, FiShield, FiDollarSign, FiClock, FiTrash2, FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    icon: FiShield,
    tag: 'SECURITY',
    tagColor: '#0d9488',
    iconColor: '#0d9488',
    iconBg: 'rgba(13, 148, 136, 0.1)',
    title: 'Escrow Security Active',
    message: 'All task payments are protected in secure milestone escrow.',
    time: 'Just now',
    read: false,
    link: '/browse'
  },
  {
    id: 2,
    icon: FiDollarSign,
    tag: 'PAYOUT',
    tagColor: '#10b981',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    title: 'Instant Payouts Enabled',
    message: 'Posters can release Razorpay payouts immediately upon reviewing code.',
    time: '2h ago',
    read: false,
    link: '/my-tasks'
  },
  {
    id: 3,
    icon: FiClock,
    tag: 'TASK FEED',
    tagColor: '#6366f1',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.1)',
    title: 'New Tasks Available',
    message: 'Fresh coding tasks matching your skills are open in the task feed.',
    time: 'Yesterday',
    read: true,
    link: '/browse'
  }
];

function NotificationPopover({ variant = 'dark' }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('extask_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const popoverRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    localStorage.setItem('extask_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-wrapper" ref={popoverRef}>
      <button
        className={`notification-trigger ${variant === 'light' ? 'light' : ''} ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        title="Activity & Notifications"
      >
        <FiBell size={17} />
        {unreadCount > 0 && (
          <span className="notification-badge-dot" />
        )}
      </button>

      {open && (
        <div className="notification-popover">
          <div className="notification-header">
            <div className="notification-title-row">
              <span className="notification-title">Notifications</span>
              {unreadCount > 0 && (
                <span className="notification-count-tag">{unreadCount} new</span>
              )}
            </div>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button className="notif-text-btn" onClick={markAllAsRead} title="Mark all as read">
                  <FiCheck size={12} style={{ marginRight: '3px' }} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notif-icon-btn" onClick={clearAll} title="Clear all notifications">
                  <FiTrash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(item => {
                const IconComponent = item.icon || FiCheckCircle;
                return (
                  <Link
                    key={item.id}
                    to={item.link || '#'}
                    className={`notification-item ${!item.read ? 'unread' : ''}`}
                    onClick={() => {
                      setNotifications(prev =>
                        prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                      );
                      setOpen(false);
                    }}
                  >
                    <div 
                      className="notif-icon-box" 
                      style={{ 
                        color: item.iconColor, 
                        background: item.iconBg || 'rgba(13, 148, 136, 0.1)' 
                      }}
                    >
                      <IconComponent size={15} />
                    </div>
                    <div className="notif-content">
                      <div className="notif-item-header">
                        <div className="notif-title-badge-wrap">
                          <span className="notif-item-title">{item.title}</span>
                          {item.tag && (
                            <span 
                              className="notif-item-tag" 
                              style={{ color: item.tagColor, borderColor: `${item.tagColor}33` }}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <span className="notif-item-time">{item.time}</span>
                      </div>
                      <p className="notif-item-message">{item.message}</p>
                    </div>
                    {!item.read && <span className="notif-unread-indicator" />}
                  </Link>
                );
              })
            ) : (
              <div className="notification-empty">
                <div className="empty-bell-circle">
                  <FiBell size={20} />
                </div>
                <p className="empty-title">All caught up!</p>
                <span className="empty-subtitle">You have no unread notifications or alerts.</span>
              </div>
            )}
          </div>

          <div className="notification-footer">
            <Link to="/browse" className="notif-footer-link" onClick={() => setOpen(false)}>
              Explore task marketplace <FiArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPopover;
