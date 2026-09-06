import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiX, FiPlus, FiShield, FiExternalLink, FiDollarSign, FiTag, FiFileText } from 'react-icons/fi';

/**
 * QuickPostModal — ReactBits ScrollExpand Inspired Modal
 * Expanding glass modal mounted via Portal allowing users to post tasks instantly from the Home screen.
 */
function QuickPostModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '500',
    deliveryType: 'GitHub Link',
  });
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimateIn(true), 15);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.budget) {
      toast.error("Please provide a task title and budget.");
      return;
    }
    if (isNaN(formData.budget) || parseInt(formData.budget) <= 0) {
      toast.error("Budget must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        budget: parseInt(formData.budget),
        postedBy: user.id,
      };
      await API.post('/tasks/add', payload);
      toast.success("Task posted successfully!");
      onClose();
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data || "Failed to post task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalJSX = (
    <div
      className={`quick-post-overlay ${animateIn ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`quick-post-modal ${animateIn ? 'expanded' : ''}`}>
        {/* Modal Header */}
        <div className="quick-post-header">
          <div className="header-left">
            <span className="quick-post-badge">INSTANT POST</span>
            <h2 className="quick-post-title">Post a Task</h2>
          </div>
          <div className="header-actions">
            <Link
              to="/post"
              className="quick-post-expand-link"
              onClick={onClose}
              title="Open full page post view"
            >
              <FiExternalLink size={15} /> Full Page
            </Link>
            <button
              type="button"
              className="quick-post-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!user ? (
          <div className="quick-post-auth-prompt">
            <div className="prompt-icon-wrap">
              <FiShield size={36} color="#2dd4bf" />
            </div>
            <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', fontWeight: 800 }}>Authentication Required</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>You need to be signed in to post a coding task to the campus exchange feed.</p>
            <div className="prompt-cta-row">
              <Link to="/login" className="btn-primary" onClick={onClose}>
                Sign In
              </Link>
              <Link to="/register" className="btn-secondary" onClick={onClose}>
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="quick-post-form">
            <div className="form-field">
              <label>
                <FiFileText size={14} /> Task Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Implement Responsive React Navbar & Routing"
                value={formData.title}
                onChange={handleChange}
                maxLength={150}
                required
                autoFocus
              />
            </div>

            <div className="form-field">
              <label>Detailed Requirements</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe deliverables, tech stack, constraints, or expected input/output."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="quick-post-row">
              <div className="form-field" style={{ flex: 1 }}>
                <label>
                  <FiDollarSign size={14} /> Budget (INR)
                </label>
                <input
                  type="number"
                  name="budget"
                  placeholder="500"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
                <div className="preset-budget-chips">
                  {[300, 500, 1000, 2000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      className={`preset-chip ${formData.budget == amt ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, budget: amt.toString() })}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field" style={{ flex: 1 }}>
                <label>
                  <FiTag size={14} /> Delivery Format
                </label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                >
                  <option value="GitHub Link">GitHub Link</option>
                  <option value="Zip File">Zip File</option>
                  <option value="Direct Code">Direct Code</option>
                </select>
              </div>
            </div>

            <div className="quick-post-footer">
              <div className="escrow-notice">
                <FiShield size={14} color="#2dd4bf" />
                <span>Protected by Razorpay escrow</span>
              </div>
              <button
                type="submit"
                className="btn-primary quick-post-submit-btn"
                disabled={loading}
              >
                <FiPlus size={16} /> {loading ? "Publishing..." : "Publish Task Now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.body);
}

export default QuickPostModal;
