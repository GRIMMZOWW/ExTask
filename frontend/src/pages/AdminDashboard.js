import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiUsers, FiLayers, FiCreditCard, FiArrowRight, FiShield } from 'react-icons/fi';
import BrandMedia from '../components/BrandMedia';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const userRole = user?.role;

  useEffect(() => {
    if (!userId || userRole !== 'ADMIN') {
      toast.error("Access denied. Admins only.");
      navigate('/');
      return;
    }

    setLoading(true);
    Promise.all([
      API.get(`/users/getall?adminId=${userId}`),
      API.get(`/tasks/getall`),
      API.get(`/payments/getall?adminId=${userId}`)
    ])
      .then(([usersRes, tasksRes, paymentsRes]) => {
        setUsers(usersRes.data);
        setTasks(tasksRes.data);
        setPayments(paymentsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load administration reports");
        setLoading(false);
      });
  }, [userId, userRole, navigate]);

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

  const totalBudget = tasks.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="admin-page page-transition">
      <div className="page-header admin-header">
        <BrandMedia 
          variant="admin"
          badge="OPERATIONS & GOVERNANCE"
          title="Admin Dashboard"
          subtitle="Manage users, tasks, and transactions across the campus exchange."
        />
      </div>

      <div className="workspace-inner">
      {loading ? (
        <div className="loading-spinner" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading administrative data...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon"><FiUsers size={20} /></div>
              <div className="stat-body">
                <span className="stat-value">{users.length}</span>
                <span className="stat-label">Registered Users</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiLayers size={20} /></div>
              <div className="stat-body">
                <span className="stat-value">{tasks.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <span className="stat-sub">Budget pool: {totalBudget} INR</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiCreditCard size={20} /></div>
              <div className="stat-body">
                <span className="stat-value">{totalPaid} INR</span>
                <span className="stat-label">Total Paid</span>
              </div>
              <span className="stat-sub">{payments.length} transactions</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar">
            <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
              Tasks ({tasks.length})
            </button>
            <button className={`tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
              Payments ({payments.length})
            </button>
            <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              Users ({users.length})
            </button>
          </div>

          {/* Tables */}
          <div className="admin-table-wrap">
            {activeTab === 'tasks' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Posted By</th>
                    <th>Accepter</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td className="mono">{task.id}</td>
                      <td><strong>{task.title}</strong></td>
                      <td className="mono">User {task.postedBy}</td>
                      <td className="mono">{task.acceptedBy ? `User ${task.acceptedBy}` : '—'}</td>
                      <td>{task.budget} INR</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(task.status)}`}>
                          {task.status === 'CHANGE_REQUESTED' ? 'CHANGE REQUESTED' : task.status}
                        </span>
                      </td>
                      <td><Link to={`/task/${task.id}`} className="table-action">View <FiArrowRight size={11} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'payments' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task ID</th>
                    <th>Amount</th>
                    <th>Order ID</th>
                    <th>Payment ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td className="mono">{payment.id}</td>
                      <td className="mono">Task {payment.taskId}</td>
                      <td>{payment.amount} INR</td>
                      <td><code className="code-inline">{payment.razorpayOrderId}</code></td>
                      <td><code className="code-inline">{payment.razorpayPaymentId || 'N/A'}</code></td>
                      <td><span className={`status-badge ${payment.status === 'PAID' ? 'badge-paid' : 'badge-open'}`}>{payment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'users' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Security</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="mono">{u.id}</td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>{u.role}</span></td>
                      <td><span className="role-badge role-user" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>BCrypt Hashed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default AdminDashboard;
