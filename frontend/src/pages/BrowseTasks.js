import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import FadeContent from '../components/FadeContent';
import BrandMedia from '../components/BrandMedia';
import MorphSlider from '../components/MorphSlider';
import ScrambledText from '../components/ScrambledText';
import { FiSearch } from 'react-icons/fi';

function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = statusFilter ? `/tasks/getall?status=${statusFilter}` : '/tasks/getall';
    API.get(url)
      .then(res => { setTasks(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [statusFilter]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'OPEN', label: 'Open' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'PAID', label: 'Paid' },
  ];

  return (
    <div className="browse-page page-transition">
      {/* Full-width editorial header */}
      <BrandMedia
        variant="browse"
        badge={<ScrambledText text="CAMPUS OPPORTUNITIES" speed={30} />}
        title="Tasks worth taking."
        subtitle="Find campus tasks, practical work, creative requests, and technical projects."
      />

      {/* Inner content — constrained to max-width */}
      <div className="browse-inner">
        <div className="marketplace-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          {/* Search Input field */}
          <div className="toolbar-search" style={{ flex: '1', minWidth: '240px' }}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search tasks by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* MorphSlider Status Filter */}
          <MorphSlider
            options={statusOptions}
            activeValue={statusFilter}
            onChange={setStatusFilter}
          />
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
