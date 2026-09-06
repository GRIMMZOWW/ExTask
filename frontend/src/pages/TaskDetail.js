import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import SpotlightCard from '../components/SpotlightCard';
import BrandMedia from '../components/BrandMedia';
import { 
  FiDollarSign, 
  FiTag, 
  FiUser, 
  FiChevronLeft, 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiEdit3, 
  FiAlertCircle, 
  FiRepeat, 
  FiShield, 
  FiTrash2, 
  FiSend 
} from 'react-icons/fi';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryContent, setDeliveryContent] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = () => {
    setLoading(true);
    API.get(`/tasks/get/${id}`)
      .then(res => {
        setTask(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load task details");
        setLoading(false);
      });
  };

  // 1. Accept Task Action
  const handleAccept = async () => {
    if (!user) {
      toast.warning("Please login to accept tasks");
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN') {
      toast.error("Admins cannot accept tasks as solvers.");
      return;
    }
    setActionLoading(true);
    try {
      await API.post(`/tasks/accept/${task.id}`, { userId: user.id });
      toast.success("Task accepted successfully!");
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.response?.data || "Failed to accept task");
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Submit Task Delivery Action (from ACCEPTED or CHANGE_REQUESTED)
  const handleSubmitDelivery = async (e) => {
    e.preventDefault();
    if (!deliveryContent.trim()) {
      toast.error("Please provide delivery details.");
      return;
    }
    setActionLoading(true);
    try {
      await API.post(`/tasks/submit/${task.id}`, { 
        userId: user.id, 
        deliveryContent: deliveryContent.trim() 
      });
      toast.success(task.status === 'CHANGE_REQUESTED' ? "Revised delivery submitted successfully!" : "Task delivery submitted successfully!");
      setDeliveryContent('');
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.response?.data || "Failed to submit delivery");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Request Changes Action
  const handleRequestChanges = async (e) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) {
      toast.error("Please provide feedback describing what changes are needed.");
      return;
    }
    setActionLoading(true);
    try {
      await API.post(`/tasks/request-changes/${task.id}`, {
        userId: user.id,
        feedback: revisionFeedback.trim()
      });
      toast.success("Change request submitted to solver!");
      setShowRevisionModal(false);
      setRevisionFeedback('');
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.response?.data || "Failed to request changes");
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Approve & Pay Action (Razorpay Popup integration)
  const handleApproveAndPay = async () => {
    if (user?.role === 'ADMIN') {
      toast.error("Admins cannot initiate task payments.");
      return;
    }
    setActionLoading(true);
    try {
      // Step A: Create order on backend
      const response = await API.post('/payments/create-order', { taskId: task.id });
      const paymentData = response.data;

      // Step B: Set up Razorpay popup
      const options = {
        "key": paymentData.key,
        "amount": paymentData.amount * 100, // in paise
        "currency": paymentData.currency || "INR",
        "name": "ExTask Campus Exchange",
        "description": `Task Payment: ${task.title}`,
        "order_id": paymentData.razorpayOrderId,
        "handler": async function (checkoutResponse) {
          try {
            // Step C: Confirm payment on backend
            await API.post('/payments/confirm', {
              razorpayOrderId: checkoutResponse.razorpay_order_id,
              razorpayPaymentId: checkoutResponse.razorpay_payment_id
            });
            toast.success("Payment successful! Task marked as PAID.");
            fetchTaskDetails();
          } catch (err) {
            toast.error("Payment confirmation failed on backend");
          }
        },
        "prefill": {
          "name": user.name,
          "email": user.email
        },
        "theme": {
          "color": "#0d9488"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data || "Failed to initiate payment checkout");
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Delete Task Action (Open tasks only by poster)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setActionLoading(true);
    try {
      await API.delete(`/tasks/delete/${task.id}?userId=${user.id}`);
      toast.success("Task deleted successfully");
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

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

  const isPoster = user && task && user.id === task.postedBy;
  const isAccepter = user && task && user.id === task.acceptedBy;
  const isAdmin = user && user.role === 'ADMIN';

  const getFormatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="detail-page page-transition">
      {/* Full-width BrandMedia header */}
      <div className="page-header detail-header">
        <BrandMedia
          variant="detail"
          badge="TASK EXCHANGE"
          title={task ? `Task #${task.id}: ${task.title}` : 'Task Details'}
          subtitle="Review task specifications, deliverables, and milestone payouts."
        />
      </div>

      <div className="workspace-inner">
        <div style={{ marginBottom: '14px' }}>
          <Link to="/browse" className="back-link" style={{ marginBottom: 0 }}>
            <FiChevronLeft /> Back to Tasks
          </Link>
        </div>

      {loading ? (
        <div className="loading-spinner" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading task details...
        </div>
      ) : !task ? (
        <div className="empty-state">
          <p>Task not found.</p>
          <Link to="/browse" className="btn-primary btn-sm">Back to Feed</Link>
        </div>
      ) : (
        <div className="detail-layout">
          {/* LEFT: Task Info */}
          <div className="detail-main">
            {isAdmin && (
              <div className="admin-view-banner">
                <FiShield size={16} />
                <span>
                  <strong>Admin View Mode:</strong> You are viewing this task with read-only administrative oversight. Action buttons are disabled.
                </span>
              </div>
            )}

            <div className="detail-head">
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status === 'CHANGE_REQUESTED' ? 'CHANGE REQUESTED' : task.status}
              </span>
              <h1 className="detail-title">{task.title}</h1>
            </div>

            <div className="detail-meta-strip">
              <div className="meta-chip">
                <FiDollarSign size={14} />
                <div>
                  <span className="meta-label">Budget</span>
                  <span className="meta-value">{task.budget} INR</span>
                </div>
              </div>
              <div className="meta-chip">
                <FiTag size={14} />
                <div>
                  <span className="meta-label">Delivery</span>
                  <span className="meta-value">{task.deliveryType}</span>
                </div>
              </div>
              <div className="meta-chip">
                <FiClock size={14} />
                <div>
                  <span className="meta-label">Posted</span>
                  <span className="meta-value">{getFormatDate(task.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Revision Feedback Alert Banner */}
            {task.status === 'CHANGE_REQUESTED' && task.revisionFeedback && (
              <div className="revision-feedback-box">
                <div className="feedback-header">
                  <FiAlertCircle size={18} />
                  <h4>Revision Requested by Poster</h4>
                </div>
                <p className="feedback-content">{task.revisionFeedback}</p>
                {isAccepter && (
                  <p className="feedback-instruction">
                    Please review the feedback above, update your deliverables, and resubmit using the form on the right.
                  </p>
                )}
              </div>
            )}

            <div className="detail-desc-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-desc-text">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Delivery Content Display */}
            {(task.status === 'SUBMITTED' || task.status === 'CHANGE_REQUESTED' || task.status === 'PAID') && 
             task.deliveryContent && 
             (isPoster || isAccepter || isAdmin) && (
              <div className="detail-delivery-box">
                <h3 className="detail-section-title">
                  <FiFileText /> {task.status === 'CHANGE_REQUESTED' ? 'Previous Deliverables' : 'Submitted Deliverables'}
                </h3>
                <p className="delivery-format-note">
                  Delivered as <strong>{task.deliveryType}</strong>:
                </p>
                <pre className="delivery-code">
                  {task.deliveryContent}
                </pre>
              </div>
            )}
          </div>

          {/* RIGHT: Action Panel */}
          <SpotlightCard className="detail-sidebar" spotlightColor="rgba(13, 148, 136, 0.08)">
            <h3 className="sidebar-heading">Task Status & Actions</h3>
            
            <div className="action-zone">
              {/* Status Progression details */}
              <div className="status-progression">
                <div className="status-progress-step">
                  <span className="progress-marker">CURRENT STATUS</span>
                  <span className="progress-value">
                    {task.status === 'CHANGE_REQUESTED' ? 'CHANGE REQUESTED' : task.status}
                  </span>
                </div>
                
                <div className="status-progress-step">
                  <span className="progress-marker">WHAT HAPPENS NEXT</span>
                  <span className="progress-text">
                    {task.status === 'OPEN' && "A verified campus peer accepts the task and begins work."}
                    {task.status === 'ACCEPTED' && "Work is in progress by the assigned solver."}
                    {task.status === 'SUBMITTED' && "Deliverables are submitted and awaiting poster review or change request."}
                    {task.status === 'CHANGE_REQUESTED' && "The solver is revising the deliverables based on feedback."}
                    {task.status === 'PAID' && "Payment is disbursed and the task is successfully closed."}
                  </span>
                </div>

                <div className="status-progress-step">
                  <span className="progress-marker">WHAT DO I NEED TO DO</span>
                  <span className="progress-desc">
                    {isAdmin ? (
                      "Admins observe and monitor campus activity. No operational action required."
                    ) : (
                      <>
                        {task.status === 'OPEN' && (isPoster ? "Wait for a campus peer to accept, or edit requirements if needed." : "Click Accept below to take on this task.")}
                        {task.status === 'ACCEPTED' && (isAccepter ? "Complete the work and submit your deliverables below." : "Solver is completing the requested work.")}
                        {task.status === 'SUBMITTED' && (isPoster ? "Review deliverables: Click 'Approve & Pay' or 'Request Changes'." : "Awaiting poster's review or payment.")}
                        {task.status === 'CHANGE_REQUESTED' && (isAccepter ? "Update your deliverables and click 'Submit Revised Deliverables' below." : "Solver is updating the deliverable based on your feedback.")}
                        {task.status === 'PAID' && "No further action needed. Task is complete."}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="sidebar-divider" />

              {/* ACTION BUTTONS (Non-Admin Users Only) */}
              {!isAdmin && (
                <>
                  {/* OPEN TASK ACTIONS */}
                  {task.status === 'OPEN' && !isPoster && (
                    <button onClick={handleAccept} className="btn-primary btn-full" disabled={actionLoading}>
                      {actionLoading ? "Accepting..." : "Accept Task"}
                    </button>
                  )}

                  {task.status === 'OPEN' && isPoster && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link to={`/edit-task/${task.id}`} className="btn-secondary btn-full" style={{ textAlign: 'center' }}>
                        <FiEdit3 /> Edit Task Details
                      </Link>
                      <button onClick={handleDelete} className="btn-danger btn-full" disabled={actionLoading}>
                        <FiTrash2 /> Delete Task
                      </button>
                    </div>
                  )}

                  {/* ACCEPTED TASK ACTIONS: Solver submits */}
                  {task.status === 'ACCEPTED' && isAccepter && (
                    <form onSubmit={handleSubmitDelivery} className="submit-form">
                      <div className="form-field">
                        <label>Submission ({task.deliveryType})</label>
                        <textarea
                          rows={4}
                          placeholder={task.deliveryType === 'GitHub Link' ? "Paste complete GitHub repository or PR link..." : "Enter file link, ZIP URL, or direct code..."}
                          value={deliveryContent}
                          onChange={(e) => setDeliveryContent(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn-primary btn-full" disabled={actionLoading}>
                        <FiSend /> {actionLoading ? "Submitting..." : "Submit Deliverables"}
                      </button>
                    </form>
                  )}

                  {/* CHANGE_REQUESTED TASK ACTIONS: Solver resubmits */}
                  {task.status === 'CHANGE_REQUESTED' && isAccepter && (
                    <form onSubmit={handleSubmitDelivery} className="submit-form">
                      <div className="form-field">
                        <label>Revised Submission ({task.deliveryType})</label>
                        <textarea
                          rows={4}
                          placeholder="Paste updated link, repository, or modified deliverables..."
                          value={deliveryContent}
                          onChange={(e) => setDeliveryContent(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn-primary btn-full" disabled={actionLoading}>
                        <FiSend /> {actionLoading ? "Submitting..." : "Submit Revised Deliverables"}
                      </button>
                    </form>
                  )}

                  {/* SUBMITTED TASK ACTIONS: Poster approves or requests changes */}
                  {task.status === 'SUBMITTED' && isPoster && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={handleApproveAndPay} className="btn-pay btn-full" disabled={actionLoading}>
                        <FiCheckCircle /> {actionLoading ? "Processing..." : `Approve & Pay (${task.budget} INR)`}
                      </button>
                      
                      {!showRevisionModal ? (
                        <button 
                          onClick={() => setShowRevisionModal(true)} 
                          className="btn-secondary btn-full"
                          type="button"
                        >
                          <FiRepeat /> Request Changes
                        </button>
                      ) : (
                        <form onSubmit={handleRequestChanges} className="revision-form" style={{ marginTop: '8px' }}>
                          <div className="form-field">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>
                              <FiAlertCircle /> Describe Required Revisions
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Specify exactly what needs to be changed or corrected before approval..."
                              value={revisionFeedback}
                              onChange={(e) => setRevisionFeedback(e.target.value)}
                              required
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" className="btn-warning btn-full" disabled={actionLoading} style={{ fontSize: '0.78rem' }}>
                              {actionLoading ? "Sending..." : "Submit Request"}
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setShowRevisionModal(false)} 
                              className="btn-secondary"
                              style={{ fontSize: '0.78rem', minWidth: '70px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* PAID NOTICE */}
                  {task.status === 'PAID' && (
                    <div className="status-notice success">
                      <FiCheckCircle /> Payment complete &amp; disbursed
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="sidebar-divider" />

            <div className="timeline-list">
              <div className="timeline-row">
                <FiUser size={13} />
                <div>
                  <span className="tl-label">Posted By</span>
                  <span className="tl-value">User ID {task.postedBy} {isPoster && "(You)"}</span>
                </div>
              </div>
              {task.acceptedBy && (
                <div className="timeline-row">
                  <FiCheckCircle size={13} />
                  <div>
                    <span className="tl-label">Accepted By</span>
                    <span className="tl-value">User ID {task.acceptedBy} {isAccepter && "(You)"}</span>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      )}
      </div>
    </div>
  );
}

export default TaskDetail;
