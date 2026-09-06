import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FiMail, FiShield, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import AuthShowcase from '../components/AuthShowcase';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) { 
      toast.error("Please enter your email."); 
      return; 
    }
    setLoading(true);
    try {
      await API.post('/users/forgot-password', { email: email.trim() });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const errMsg = err.response?.data || "Email not found.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Email not found.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !otp.trim()) { 
      toast.error("Please enter the OTP."); 
      return; 
    }
    setLoading(true);
    try {
      await API.post('/users/verify-otp', { email: email.trim(), otp: otp.trim() });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      const errMsg = err.response?.data || "Invalid or expired OTP.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Invalid or expired OTP.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const pwdErr = validatePasswordField(newPassword);
    if (pwdErr) {
      toast.error(pwdErr);
      return;
    }
    setLoading(true);
    try {
      await API.post('/users/reset-password', { 
        email: email.trim(), 
        otp: otp.trim(), 
        newPassword 
      });
      toast.success("Password reset successful! Please login.");
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data || "Failed to reset password.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Failed to reset password.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-split-page page-transition">
      <div className="auth-split-container">
        {/* Left Side: Brand Showcase */}
        <AuthShowcase variant="forgot" />

        {/* Right Side: Auth Form */}
        <div className="auth-form-panel">
          <div className="step-indicator">
            {[1, 2, 3].map(s => (
              <span key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
            ))}
          </div>

          <div className="auth-header-text">
            <span className="auth-badge">
              {step === 1 && "RECOVERY"}
              {step === 2 && "VERIFY OTP"}
              {step === 3 && "SET PASSWORD"}
            </span>
            <h1 className="auth-title">
              {step === 1 && "Reset your password"}
              {step === 2 && "Verify OTP code"}
              {step === 3 && "Choose new password"}
            </h1>
            <p className="auth-subtitle">
              {step === 1 && "Enter your registered campus email to receive a verification code."}
              {step === 2 && `Enter the 6-digit code sent to ${email || 'your email'}.`}
              {step === 3 && "Choose a strong new password for your account."}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="auth-form">
              <div className="form-field">
                <label htmlFor="reset-email"><FiMail /> Registered Email Address</label>
                <input 
                  id="reset-email"
                  type="email" 
                  placeholder="you@university.edu" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Sending code..." : "Send Verification Code"} <FiArrowRight size={15} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-field">
                <label htmlFor="reset-otp"><FiShield /> 6-Digit OTP Code</label>
                <input 
                  id="reset-otp"
                  type="text" 
                  placeholder="e.g. 123456" 
                  maxLength={6} 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  autoComplete="one-time-code"
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem', fontWeight: '700' }}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"} <FiArrowRight size={15} style={{ marginLeft: '4px' }} />
              </button>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary btn-full" style={{ marginTop: '8px' }}>
                <FiArrowLeft size={14} style={{ marginRight: '4px' }} /> Back to Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-field">
                <label htmlFor="reset-new-password"><FiLock /> New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    id="reset-new-password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    autoComplete="new-password"
                    required
                    autoFocus
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
                <div className="password-guidance-hint">
                  Must contain 8+ chars with uppercase, lowercase, number & symbol.
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Saving password..." : "Save New Password"} <FiArrowRight size={15} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          )}

          <p className="auth-footer-text">
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
