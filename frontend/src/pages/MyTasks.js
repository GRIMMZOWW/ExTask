import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { FiSend, FiInbox, FiClock, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import MorphSlider from '../components/MorphSlider';
import ScrambledText from '../components/ScrambledText';

function MyTasks() {
  const [postedTasks, setPostedTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('posted');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    setLoading(true);
    Promise.all([
      API.get(`/tasks/by-user/${userId}`),
      API.get(`/tasks/accepted-by/${userId}`)
    ])
      .then(([postedRes, acceptedRes]) => {
        setPostedTasks(postedRes.data);
        setAcceptedTasks(acceptedRes.data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [userId, navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-open';
      case 'ACCEPTED': return 'badge-accepted';
      case 'SUBMITTED': return 'badge-submitted';
      case 'CHANGE_REQUESTED': return 'badge-revision';
      case 'PAID': return 'badge-paid';
      default: return '';
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  const renderTable = (tasks, emptyMsg, emptyLink, emptyLabel) => {
    if (tasks.length === 0) {
      return (
        <div className="empty-state">
          <p>{emptyMsg}</p>
          <Link to={emptyLink} className="btn-primary btn-sm" style={{ marginTop: '12px', display: 'inline-flex' }}>{emptyLabel}</Link>
        </div>
      );
    }
    return (
      <div className="task-table">
        <div className="table-header">
          <span>Task</span><span>Date</span><span>Budget</span><span>Status</span><span></span>
        </div>
        {tasks.map(task => (
          <div className="table-row" key={task.id}>
            <span className="table-title">{task.title}</span>
            <span className="table-meta"><FiClock size={12} /> {formatDate(task.createdAt)}</span>
            <span className="table-meta bold"><FiDollarSign size={12} /> {task.budget} INR</span>
            <span>
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status === 'CHANGE_REQUESTED' ? 'REVISION' : task.status}
              </span>
            </span>
            <span><Link to={`/task/${task.id}`} className="table-action">View <FiArrowRight size={12} /></Link></span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="workspace-page page-transition">
      {/* Clean Editorial Page Header */}
      <div className="page-header tasks-header">
        <span className="page-eyebrow">
          <ScrambledText text="TASK MANAGEMENT" speed={30} />
        </span>
        <h1 className="page-title">Your tasks.</h1>
        <p className="page-subtitle">Track what you've posted and the work you've taken on.</p>
      </div>

      <div className="workspace-inner">
        <div style={{ marginBottom: '24px' }}>
          <MorphSlider
            options={[
              { value: 'posted', label: 'Posted Tasks', count: postedTasks.length, icon: <FiSend size={14} /> },
              { value: 'accepted', label: 'Accepted Tasks', count: acceptedTasks.length, icon: <FiInbox size={14} /> },
            ]}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {loading ? (
          <div className="loading-spinner" style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading your tasks...
          </div>
        ) : (
          activeTab === 'posted'
            ? renderTable(postedTasks, "You haven't posted any tasks yet.", '/post', 'Post a Task')
            : renderTable(acceptedTasks, "You haven't accepted any tasks yet.", '/browse', 'Browse Tasks')
        )}
      </div>
    </div>
  );
}

export default MyTasks;
