import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { FiPlus, FiSearch, FiClock, FiDollarSign, FiArrowRight, FiCheckCircle, FiSend, FiInbox } from 'react-icons/fi';
import FadeContent from '../components/FadeContent';
import BrandMedia from '../components/BrandMedia';
import SpotlightCard from '../components/SpotlightCard';
import StarBorder from '../components/StarBorder';
import ScrambledText from '../components/ScrambledText';

function Dashboard() {
  const [postedTasks, setPostedTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

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
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, navigate]);

  // Combine and sort tasks to find recent activity
  const allTasks = [...postedTasks, ...acceptedTasks];
  const sortedRecentTasks = allTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Compute status metrics
  const postedCount = postedTasks.length;
  const acceptedCount = acceptedTasks.length;
  
  // Count by status from all tasks
  const submittedCount = allTasks.filter(t => t.status === 'SUBMITTED' || t.status === 'CHANGE_REQUESTED').length;
  const paidCount = allTasks.filter(t => t.status === 'PAID').length;

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

  return (
    <div className="workspace-page page-transition">
      {/* Full-width BrandMedia header */}
      <div className="page-header dashboard-header">
        <BrandMedia
          variant="dashboard"
          badge={<ScrambledText text="STUDENT WORKSPACE" speed={30} />}
          title={`Your workspace, ${user?.name ? user.name.split(' ')[0] : 'Student'}.`}
          subtitle="Track your campus commitments, review deliverables, and oversee payouts."
        />
      </div>

      <div className="workspace-inner">
      {loading ? (
        <div className="loading-spinner" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading dashboard details...
        </div>
      ) : (
        <FadeContent direction="up" distance={12} duration={400}>
          {/* Quick Overview Summary Cards with SpotlightCard */}
          <div className="dashboard-stats">
            <SpotlightCard className="stat-card" spotlightColor="rgba(20, 184, 166, 0.08)">
              <div className="stat-icon"><FiSend size={18} /></div>
              <div className="stat-body">
                <span className="stat-value">{postedCount}</span>
                <span className="stat-label">Posted by Me</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="stat-card" spotlightColor="rgba(20, 184, 166, 0.08)">
              <div className="stat-icon"><FiInbox size={18} /></div>
              <div className="stat-body">
                <span className="stat-value">{acceptedCount}</span>
                <span className="stat-label">Accepted by Me</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="stat-card" spotlightColor="rgba(20, 184, 166, 0.08)">
              <div className="stat-icon"><FiClock size={18} /></div>
              <div className="stat-body">
                <span className="stat-value">{submittedCount}</span>
                <span className="stat-label">In Review / Revisions</span>
              </div>
            </SpotlightCard>
            <SpotlightCard className="stat-card" spotlightColor="rgba(20, 184, 166, 0.08)">
              <div className="stat-icon"><FiCheckCircle size={18} /></div>
              <div className="stat-body">
                <span className="stat-value">{paidCount}</span>
                <span className="stat-label">Completed &amp; Paid</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Two-Column Quick Actions & Recent Activity Layout */}
          <div className="dashboard-layout-grid">
            {/* Recent Activity List */}
            <div className="detail-main" style={{ padding: '24px' }}>
              <h3 className="detail-section-title" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>Recent Activity</h3>
              {sortedRecentTasks.length > 0 ? (
                <div className="task-table" style={{ width: '100%' }}>
                  {sortedRecentTasks.map(task => (
                    <div className="table-row" key={task.id} style={{ gridTemplateColumns: '1fr 90px 110px 60px', padding: '12px 8px' }}>
                      <span className="table-title" style={{ fontSize: '0.82rem' }}>{task.title}</span>
                      <span className="table-meta bold" style={{ fontSize: '0.78rem' }}><FiDollarSign size={11} /> {task.budget} INR</span>
                      <span>
                        <span className={`status-badge ${getStatusClass(task.status)}`} style={{ fontSize: '0.65rem' }}>
                          {task.status === 'CHANGE_REQUESTED' ? 'REVISION' : task.status}
                        </span>
                      </span>
                      <span>
                        <Link to={`/task/${task.id}`} className="table-action" style={{ fontSize: '0.75rem' }}>
                          View <FiArrowRight size={11} />
                        </Link>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <p>No recent activity. Try posting or browsing tasks.</p>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="detail-sidebar" style={{ padding: '24px' }}>
              <h3 className="sidebar-heading" style={{ marginBottom: '16px' }}>Quick Actions</h3>
              <div className="action-zone">
                <StarBorder color="#2dd4bf" speed="4.5s" style={{ width: '100%' }}>
                  <Link to="/post" className="btn-primary btn-full" style={{ fontSize: '0.8rem', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', margin: 0 }}>
                    <FiPlus size={14} /> Post a Task
                  </Link>
                </StarBorder>
                <Link to="/browse" className="btn-secondary btn-full" style={{ fontSize: '0.8rem', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <FiSearch size={14} /> Browse Tasks
                </Link>
                <Link to="/my-tasks" className="btn-secondary btn-full" style={{ fontSize: '0.8rem', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <FiInbox size={14} /> View All My Tasks
                </Link>
              </div>
            </div>
          </div>
        </FadeContent>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
