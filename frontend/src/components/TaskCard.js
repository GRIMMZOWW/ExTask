import React from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiTag, FiClock, FiArrowRight } from 'react-icons/fi';
import SpotlightCard from './SpotlightCard';

function TaskCard({ task }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-open';
      case 'ACCEPTED': return 'badge-accepted';
      case 'SUBMITTED': return 'badge-submitted';
      case 'PAID': return 'badge-paid';
      default: return '';
    }
  };

  const getCategory = (t) => {
    const text = ((t.title || '') + ' ' + (t.description || '')).toLowerCase();
    if (text.includes('note') || text.includes('summary') || text.includes('assignment')) return { label: 'Notes', cls: 'cat-notes' };
    if (text.includes('practical') || text.includes('lab') || text.includes('experiment') || text.includes('report')) return { label: 'Practical', cls: 'cat-practical' };
    if (text.includes('code') || text.includes('react') || text.includes('bug') || text.includes('api') || text.includes('java') || text.includes('sql') || text.includes('python')) return { label: 'Coding', cls: 'cat-coding' };
    if (text.includes('design') || text.includes('ui') || text.includes('presentation') || text.includes('slide') || text.includes('poster')) return { label: 'Design', cls: 'cat-design' };
    return { label: 'Campus Task', cls: 'cat-general' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const category = getCategory(task);

  return (
    <SpotlightCard className="task-card" spotlightColor="rgba(13, 148, 136, 0.08)">
      <div className="card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
          <span className={`category-badge ${category.cls}`}>{category.label}</span>
        </div>
        <span className="card-date"><FiClock size={12} /> {formatDate(task.createdAt)}</span>
      </div>
      
      <h3 className="card-title">{task.title}</h3>
      
      <p className="card-desc">
        {task.description && task.description.length > 100
          ? `${task.description.substring(0, 100)}...`
          : task.description || 'No description provided.'}
      </p>
      
      <div className="card-bottom">
        <div className="card-price-info">
          <span className="card-budget"><FiDollarSign size={13} /> {task.budget} INR</span>
          <span className="card-delivery-type"><FiTag size={11} /> {task.deliveryType}</span>
        </div>
        <Link to={`/task/${task.id}`} className="card-action">
          <span>View Task</span>
          <FiArrowRight size={13} />
        </Link>
      </div>
    </SpotlightCard>
  );
}

export default TaskCard;
