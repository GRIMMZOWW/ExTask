import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../components/Logo';
import BrandMedia from '../components/BrandMedia';

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
    <div className="auth-fullscreen-page page-transition">
      {/* Fullscreen Dedicated Background Image */}
      <BrandMedia variant="auth-login" className="auth-fullscreen-media" />

      <div className="auth-glass-container">
        <div className="auth-glass-card">
          <div className="auth-logo"><Logo size={32} showText={true} showSubtitle={true} variant="light" /></div>
          <h2 className="auth-title">sign in</h2>
          <p className="auth-subtitle">Sign in to continue to your campus task exchange.</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="login-email"><FiMail /> Email</label>
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
                <Link to="/forgot-password" className="field-link">Forgot?</Link>
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

            <button type="submit" className="btn-cyan-pill btn-full" disabled={loading}>
              {loading ? "signing in..." : "sign in"}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
