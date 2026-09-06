import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiChevronLeft, FiShield } from 'react-icons/fi';
import ScrambledText from '../components/ScrambledText';

function PostTask() {
  const [formData, setFormData] = useState({ title: '', description: '', budget: '', deliveryType: 'GitHub Link' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      toast.warning("Please login to post tasks");
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.budget) {
      toast.error("Please fill in the title and budget.");
      return;
    }
    if (isNaN(formData.budget) || parseInt(formData.budget) <= 0) {
      toast.error("Budget must be a positive number.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, budget: parseInt(formData.budget), postedBy: user.id };
      await API.post('/tasks/add', payload);
      toast.success("Task posted successfully!");
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data || "Failed to post task.");
    } finally { setLoading(false); }
  };

  return (
    <div className="workspace-page post-page page-transition">
      {/* Clean Editorial Page Header */}
      <div className="page-header post-header">
        <span className="page-eyebrow">
          <ScrambledText text="CREATE & COLLABORATE" speed={30} />
        </span>
        <h1 className="page-title">Post a Task</h1>
        <p className="page-subtitle">Tell the campus what needs to get done.</p>
      </div>

      <div className="workspace-inner">
        <div style={{ marginBottom: '18px' }}>
          <Link to="/browse" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <FiChevronLeft size={16} /> Back to Task Feed
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="post-layout-grid">
          {/* LEFT: Task Details (Main Area) */}
          <div className="post-main-card">
            <div className="form-section">
              <span className="form-section-label">01 — Task Details</span>
              <div className="form-field">
                <label>Task Title</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g. Clean up Python data science assignment script" 
                  value={formData.title} 
                  onChange={handleChange} 
                  maxLength={150} 
                  required
                />
              </div>
              <div className="form-field">
                <label>Detailed Instructions & Requirements</label>
                <textarea 
                  name="description" 
                  rows={9} 
                  placeholder="Provide clear instructions. Mention frameworks, files, constraints, or expected deliverables." 
                  value={formData.description} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Budget, Delivery & Submit (Sidebar) */}
          <div className="post-sidebar-card">
            <div className="form-section">
              <span className="form-section-label">02 — Compensation</span>
              <div className="form-field">
                <label>Budget (INR)</label>
                <input 
                  type="number" 
                  name="budget" 
                  placeholder="e.g. 500" 
                  value={formData.budget} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div className="budget-preset-row">
                {[300, 500, 1000, 2000].map(amt => (
                  <button 
                    type="button" 
                    key={amt} 
                    className={`preset-chip ${formData.budget == amt ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, budget: amt })}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section" style={{ marginTop: '22px' }}>
              <span className="form-section-label">03 — Delivery Format</span>
              <div className="form-field">
                <label>Expected Solution Delivery</label>
                <select name="deliveryType" value={formData.deliveryType} onChange={handleChange}>
                  <option value="GitHub Link">GitHub Link</option>
                  <option value="Zip File">Zip File</option>
                  <option value="Direct Code">Direct Code</option>
                </select>
              </div>
            </div>

            <div className="post-guarantee-box">
              <FiShield className="guarantee-icon" size={18} />
              <p><strong>Razorpay Escrow:</strong> Payment is held securely and only released once you review and approve the submitted work.</p>
            </div>

            <button type="submit" className="btn-primary btn-full btn-post-submit" disabled={loading}>
              <FiPlus size={16} /> {loading ? "Publishing Task..." : "Publish Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostTask;
