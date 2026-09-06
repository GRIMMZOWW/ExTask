import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit3, FiChevronLeft, FiSave } from 'react-icons/fi';
import ScrambledText from '../components/ScrambledText';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deliveryType: 'GitHub Link'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      toast.warning("Please login to edit tasks");
      navigate('/login');
      return;
    }

    API.get(`/tasks/get/${id}`)
      .then(res => {
        const task = res.data;
        if (task.postedBy !== userId) {
          toast.error("Only the task owner can edit this task");
          navigate(`/task/${id}`);
          return;
        }
        if (task.status !== 'OPEN') {
          toast.error("Only OPEN tasks can be edited");
          navigate(`/task/${id}`);
          return;
        }

        setFormData({
          title: task.title || '',
          description: task.description || '',
          budget: task.budget || '',
          deliveryType: task.deliveryType || 'GitHub Link'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load task details");
        navigate('/browse');
      });
  }, [id, userId, navigate]);

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

    setSubmitting(true);
    try {
      const payload = {
        userId: userId,
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : '',
        budget: parseInt(formData.budget),
        deliveryType: formData.deliveryType
      };
      await API.post(`/tasks/edit/${id}`, payload);
      toast.success("Task updated successfully!");
      navigate(`/task/${id}`);
    } catch (err) {
      toast.error(err.response?.data || "Failed to update task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workspace-page post-page page-transition">
      {/* Clean Editorial Page Header */}
      <div className="page-header post-header">
        <span className="page-eyebrow">
          <ScrambledText text="TASK EDITOR" speed={30} />
        </span>
        <h1 className="page-title">{`Edit Task #${id}`}</h1>
        <p className="page-subtitle">Update your task requirements, budget, or delivery format while it is still open.</p>
      </div>

      <div className="workspace-inner">
      <div style={{ marginBottom: '18px' }}>
        <Link to={`/task/${id}`} className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <FiChevronLeft size={16} /> Back to Task #{id}
        </Link>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading task details...
        </div>
      ) : (
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
                  placeholder="e.g. Implement React navigation router"
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
                  placeholder="Provide clear instructions. List frameworks, input criteria, and expected outputs."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Budget, Delivery & Actions (Sidebar) */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary btn-full btn-post-submit" disabled={submitting}>
                <FiSave size={16} /> {submitting ? "Saving Changes..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-secondary btn-full"
                onClick={() => navigate(`/task/${id}`)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      </div>
    </div>
  );
}

export default EditTask;
