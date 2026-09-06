import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import AuthShowcase from '../components/AuthShowcase';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post('/users/login', {
        email: formData.email.trim(),
        password: formData.password
      });
      
      // Save to localStorage for UI state
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Dispatch profile/auth update event for immediate Navbar refresh
      window.dispatchEvent(new Event('userProfileUpdated'));
      
      toast.success("Welcome back, " + response.data.name + "!");
      
      // Role-based navigation redirect
      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data || "Invalid email or password.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page page-transition">
      <div className="auth-split-container">
        {/* Left Side: Brand Showcase */}
        <AuthShowcase variant="login" />

        {/* Right Side: Auth Form */}
        <div className="auth-form-panel">
          <div className="auth-header-text">
            <span className="auth-badge">WELCOME BACK</span>
            <h1 className="auth-title">Sign in to ExTask</h1>
            <p className="auth-subtitle">Access your campus workspace and active task commitments.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="login-email"><FiMail /> Email Address</label>
              <input 
                id="login-email"
                type="email" 
                name="email" 
                placeholder="you@university.edu" 
                value={formData.email} 
                onChange={handleChange} 
                autoComplete="email"
                required
              />
            </div>
            
            <div className="form-field">
              <div className="field-header">
                <label htmlFor="login-password"><FiLock /> Password</label>
                <Link to="/forgot-password" className="field-link">Forgot Password?</Link>
              </div>
              <div className="password-input-wrapper">
                <input 
                  id="login-password"
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  autoComplete="current-password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <FiArrowRight size={15} style={{ marginLeft: '4px' }} />
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
