import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import AuthShowcase from '../components/AuthShowcase';

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const validatePasswordField = (password) => {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 8) {
      return "Use 8+ characters with uppercase, lowercase, a number and a special character.";
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      return "Use 8+ characters with uppercase, lowercase, a number and a special character.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live validation cleanup
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateNameField(formData.name);
    const emailErr = validateEmailField(formData.email);
    const pwdErr = validatePasswordField(formData.password);
    let confirmErr = "";

    if (formData.password !== formData.confirmPassword) {
      confirmErr = "Passwords do not match.";
    }

    if (nameErr || emailErr || pwdErr || confirmErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        password: pwdErr,
        confirmPassword: confirmErr
      });
      if (nameErr) toast.error(nameErr);
      else if (emailErr) toast.error(emailErr);
      else if (pwdErr) toast.error(pwdErr);
      else if (confirmErr) toast.error(confirmErr);
      return;
    }

    setLoading(true);
    try {
      await API.post('/users/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      toast.success("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data || "Registration failed. Try again.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page page-transition">
      <div className="auth-split-container">
        {/* Left Side: Brand Showcase */}
        <AuthShowcase variant="register" />

        {/* Right Side: Auth Form */}
        <div className="auth-form-panel">
          <div className="auth-header-text">
            <span className="auth-badge">CAMPUS NETWORK</span>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join students across campus to exchange tasks and get work done.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="reg-name"><FiUser /> Username / Name (No Spaces)</label>
              <input 
                id="reg-name"
                type="text" 
                name="name" 
                placeholder="e.g. PriyaKapoor or alex_dev" 
                value={formData.name} 
                onChange={handleChange} 
                autoComplete="name"
                required
              />
              {errors.name && <p className="form-field-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="reg-email"><FiMail /> Email Address</label>
              <input 
                id="reg-email"
                type="email" 
                name="email" 
                placeholder="you@university.edu" 
                value={formData.email} 
                onChange={handleChange} 
                autoComplete="email"
                required
              />
              {errors.email && <p className="form-field-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`form-field ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="reg-password"><FiLock /> Password</label>
              <div className="password-input-wrapper">
                <input 
                  id="reg-password"
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  autoComplete="new-password"
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
              {errors.password && <p className="form-field-error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className={`form-field ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label htmlFor="reg-confirm-password"><FiLock /> Confirm Password</label>
              <div className="password-input-wrapper">
                <input 
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  autoComplete="new-password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-field-error">{errors.confirmPassword}</p>}
            </div>

            <div className="password-guidance-hint">
              Must contain 8+ chars with uppercase, lowercase, number & symbol.
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"} <FiArrowRight size={15} style={{ marginLeft: '4px' }} />
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
