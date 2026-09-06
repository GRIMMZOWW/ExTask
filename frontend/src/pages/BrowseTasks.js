import React, { useEffect, useState, useRef } from 'react';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import FadeContent from '../components/FadeContent';
import BrandMedia from '../components/BrandMedia';
import { FiFilter, FiSearch, FiChevronDown } from 'react-icons/fi';

function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const url = statusFilter ? `/tasks/getall?status=${statusFilter}` : '/tasks/getall';
    API.get(url)
      .then(res => { setTasks(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [statusFilter]);

  // Click outside and Escape key listeners to close status filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="browse-page page-transition">
      {/* Full-width editorial header */}
      <BrandMedia
        variant="browse"
        badge="CAMPUS OPPORTUNITIES"
        title="Tasks worth taking."
        subtitle="Find campus tasks, practical work, creative requests, and technical projects."
      />

      {/* Inner content — constrained to max-width */}
      <div className="browse-inner">
        <div className="marketplace-toolbar">
          {/* Search Input field */}
          <div className="toolbar-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Rebuilt Custom Task Status Dropdown */}
          <div className="toolbar-filter-wrapper" ref={filterRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="account-surface"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              style={{ height: '42px', borderRadius: 'var(--radius)', padding: '0 14px', border: '1.5px solid var(--border)' }}
            >
              <FiFilter size={14} style={{ marginRight: '4px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 550 }}>
                {statusFilter ? statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase() : 'All Statuses'}
              </span>
              <FiChevronDown className={`dropdown-chevron ${filterDropdownOpen ? 'open' : ''}`} size={12} style={{ marginLeft: '6px' }} />
            </button>

            {filterDropdownOpen && (
              <div
                className="account-dropdown show"
                style={{
                  left: 0,
                  right: 'auto',
                  width: '160px',
                  marginTop: '6px'
                }}
              >
                {[
                  { label: 'All Statuses', value: '' },
                  { label: 'Open', value: 'OPEN' },
                  { label: 'Accepted', value: 'ACCEPTED' },
                  { label: 'Submitted', value: 'SUBMITTED' },
                  { label: 'Paid', value: 'PAID' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setFilterDropdownOpen(false);
                    }}
                    className="dropdown-item"
                    style={{
                      fontWeight: statusFilter === opt.value ? '700' : '550',
                      color: statusFilter === opt.value ? 'var(--teal)' : 'var(--text-secondary)',
                      background: statusFilter === opt.value ? 'var(--teal-bg)' : 'transparent'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <FadeContent direction="up" distance={12} duration={400}>
          {loading ? (
            <div className="loading-spinner">Loading tasks...</div>
          ) : filteredTasks.length > 0 ? (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tasks match your search or filter criteria.</p>
            </div>
          )}
        </FadeContent>
      </div>
    </div>
  );
}

export default BrowseTasks;

