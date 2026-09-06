import React from 'react';
import Logo from './Logo';
import { FiShield, FiZap, FiAward, FiLock, FiCode } from 'react-icons/fi';

function AuthShowcase({ variant = 'login' }) {
  const content = {
    login: {
      badge: "Campus Developer Network",
      title: "Turn coding tasks into shipped work.",
      description: "Sign in to access your active tasks, submit deliverables, and manage Razorpay escrow payouts.",
      highlights: [
        { icon: <FiZap size={16} />, title: "Instant Micro-Tasks", desc: "Post or pick up bite-sized coding tasks with clear INR budgets." },
        { icon: <FiShield size={16} />, title: "Escrow-Protected", desc: "Payments stay securely locked until code is reviewed and approved." },
        { icon: <FiAward size={16} />, title: "Verified Reputation", desc: "Build a public campus portfolio backed by real completed work." },
      ],
      stats: [
        { label: "Tasks Solved", val: "2,400+" },
        { label: "Escrow Protected", val: "100%" },
        { label: "Avg Payout", val: "< 24h" }
      ]
    },
    register: {
      badge: "Join 1,200+ Campus Builders",
      title: "Build, collaborate & earn on campus.",
      description: "Create your student developer profile to start solving tasks, collaborating with peers, and earning verified income.",
      highlights: [
        { icon: <FiCode size={16} />, title: "Real Coding Experience", desc: "Solve real bugs, build UI components, and collaborate across campus." },
        { icon: <FiShield size={16} />, title: "Direct Escrow Payouts", desc: "Get 100% of your agreed payout transferred immediately upon approval." },
        { icon: <FiZap size={16} />, title: "Fast Task Matching", desc: "Find work matching your exact tech stack (React, Node, Python, Java)." },
      ],
      stats: [
        { label: "Active Builders", val: "1,200+" },
        { label: "INR Paid Out", val: "₹5.2L+" },
        { label: "Avg Rating", val: "4.9 / 5" }
      ]
    },
    forgot: {
      badge: "Account Recovery",
      title: "Get back to building in seconds.",
      description: "We will send a 6-digit verification code to your registered campus email to securely reset your credentials.",
      highlights: [
        { icon: <FiLock size={16} />, title: "Secure OTP Verification", desc: "One-time passcode expires in 10 minutes for airtight security." },
        { icon: <FiShield size={16} />, title: "Protected Wallet & Tasks", desc: "Your escrow balance and ongoing task history remain completely safe." },
        { icon: <FiZap size={16} />, title: "Instant Credential Reset", desc: "Update your password and jump right back into your task workspace." },
      ],
      stats: [
        { label: "OTP Delivery", val: "< 5 sec" },
        { label: "Security Rating", val: "Bank-Grade" },
        { label: "Support", val: "24/7" }
      ]
    }
  };

  const data = content[variant] || content.login;

  return (
    <div className="auth-showcase-panel">
      <div className="auth-showcase-inner">
        <div className="auth-showcase-logo">
          <Logo size={28} showText={true} showSubtitle={true} variant="light" />
        </div>

        <div className="auth-showcase-hero">
          <span className="auth-showcase-badge">{data.badge}</span>
          <h2 className="auth-showcase-title">{data.title}</h2>
          <p className="auth-showcase-desc">{data.description}</p>
        </div>

        <div className="auth-showcase-features">
          {data.highlights.map((h, i) => (
            <div key={i} className="auth-showcase-feature-item">
              <div className="feature-icon-wrapper">{h.icon}</div>
              <div className="feature-text">
                <span className="feature-title">{h.title}</span>
                <span className="feature-desc">{h.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="auth-showcase-stats">
          {data.stats.map((s, i) => (
            <div key={i} className="auth-showcase-stat-box">
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthShowcase;
