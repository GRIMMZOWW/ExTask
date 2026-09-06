import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiShield, FiSave } from 'react-icons/fi';
import ScrambledText from '../components/ScrambledText';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || ''
    });
  }, [navigate]);

  const validateNameField = (name) => {
    if (!name || !name.trim()) {
      return "Name is required.";
    }
    const trimmed = name.trim();
    if (trimmed.includes(' ') || /\s/.test(trimmed)) {
      return "Name cannot contain spaces. Use a single handle or username (e.g. JohnDoe or alex_dev).";
    }
    const nameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (trimmed.length < 3 || trimmed.length > 30 || !nameRegex.test(trimmed)) {
      return "Name must be 3-30 characters with letters, numbers, or underscores (no spaces).";
    }
    return "";
  };

  const validateEmailField = (email) => {
    if (!email || !email.trim()) {
      return "Email is required.";
    }
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateNameField(formData.name);
    const emailErr = validateEmailField(formData.email);

    if (nameErr || emailErr) {
      setErrors({ name: nameErr, email: emailErr });
      if (nameErr) toast.error(nameErr);
      else if (emailErr) toast.error(emailErr);
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/users/update/${user.id}`, {
        name: formData.name.trim(),
        email: formData.email.trim()
      });
      
      // Update localStorage with updated user properties
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      
      // Notify other components (Navbar) of user name/email updates
      window.dispatchEvent(new Event('userProfileUpdated'));
      toast.success("Profile saved successfully!");
    } catch (err) {
      const errMsg = err.response?.data || "Failed to update profile. Please try again.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading-spinner">Loading account profile...</div>;
  }

  return (
    <div className="workspace-page profile-page page-transition">
      {/* Clean Editorial Page Header */}
      <div className="page-header profile-header">
        <span className="page-eyebrow">
          <ScrambledText text="ACCOUNT & IDENTITY" speed={30} />
        </span>
        <h1 className="page-title">Your profile.</h1>
        <p className="page-subtitle">Manage your ExTask account credentials and identity.</p>
      </div>

      <div className="workspace-inner">
      <form onSubmit={handleSubmit} className="post-layout-grid" noValidate>
        {/* LEFT: Account Info (Main Area) */}
        <div className="post-main-card">
          <div className="form-section">
            <span className="form-section-label">01 — Account Information</span>
            
            <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="prof-name"><FiUser size={14} /> Username / Name (No Spaces)</label>
              <input 
                id="prof-name"
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. PriyaKapoor or alex_dev" 
                autoComplete="name"
              />
              {errors.name && <p className="form-field-error">{errors.name}</p>}
            </div>
            
            <div className={`form-field ${errors.email ? 'has-error' : ''}`} style={{ marginTop: '16px' }}>
              <label htmlFor="prof-email"><FiMail size={14} /> Email Address</label>
              <input 
                id="prof-email"
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address" 
                autoComplete="email"
              />
              {errors.email && <p className="form-field-error">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* RIGHT: Role & Save (Sidebar) */}
        <div className="post-sidebar-card">
          <div className="form-section">
            <span className="form-section-label">02 — Permissions & Status</span>
            <div className="form-field">
              <label><FiShield size={14} /> Assigned Role</label>
              <div 
                className="role-badge" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '0.82rem', 
                  width: 'fit-content',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-alt)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  marginTop: '4px'
                }}
              >
                {user.role === 'ADMIN' ? 'Administrator' : 'Student'}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                Account role permissions are managed by system administrators.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '28px' }}>
            <button type="submit" className="btn-primary btn-full btn-post-submit" disabled={loading}>
              <FiSave size={16} /> {loading ? "Saving Profile..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Profile;
