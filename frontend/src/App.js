import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiLinkedin, FiGithub, FiInstagram, FiFacebook } from 'react-icons/fi';

// Component Imports
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import DotField from './components/DotField';
import Aurora from './components/Aurora';

// Page Imports
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import BrowseTasks from './pages/BrowseTasks';
import TaskDetail from './pages/TaskDetail';
import PostTask from './pages/PostTask';
import MyTasks from './pages/MyTasks';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditTask from './pages/EditTask';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer 
          position="top-right" 
          autoClose={3500} 
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="light"
        />
        {/* Global Ambient Interactive Dot Field */}
        <DotField
          isGlobal={true}
          gap={34}
          baseRadius={1.0}
          maxRadius={2.4}
          dotColor="rgba(148, 163, 184, 0.16)"
          glowColor="rgba(45, 212, 191, 0.55)"
          proximity={90}
        />
        <Navbar />
        <main className="main-content page-transition">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/browse" element={<BrowseTasks />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/edit-task/:id" element={<EditTask />} />
            <Route path="/post" element={<PostTask />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        
        {/* Rebuilt Multi-Column Footer with Ambient Aurora Background */}
        <footer className="footer">
          <Aurora opacity={0.65} speed={1.3} colorStops={['#00f2fe', '#6366f1', '#a855f7', '#2dd4bf', '#3b82f6']}>
            <div className="footer-inner">
              <div className="footer-col brand-col">
                <Logo size={26} showText={true} variant="light" />
                <p className="footer-tagline">
                  Campus Task Exchange<br />Post tasks. Find help. Get things done.
                </p>
              </div>
              
              <div className="footer-col">
                <span className="footer-col-title">Product</span>
                <Link to="/browse" className="footer-link">Browse Tasks</Link>
                <Link to="/post" className="footer-link">Post a Task</Link>
                <Link to="/dashboard" className="footer-link">Dashboard</Link>
                <Link to="/my-tasks" className="footer-link">My Tasks</Link>
              </div>
              
              <div className="footer-col">
                <span className="footer-col-title">Account</span>
                <Link to="/profile" className="footer-link">Profile</Link>
                <Link to="/login" className="footer-link">Sign In</Link>
                <Link to="/register" className="footer-link">Create Account</Link>
              </div>
              
              <div className="footer-col">
                <span className="footer-col-title">Connect</span>
                <div className="footer-socials">
                  <a 
                    href="https://www.linkedin.com/in/the-bhaumik-172b893b6/?isSelfProfile=false" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon-link"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin size={18} />
                  </a>
                  <a 
                    href="https://github.com/GRIMMZOWW" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon-link"
                    aria-label="GitHub"
                  >
                    <FiGithub size={18} />
                  </a>
                  <span className="social-icon-link disabled" title="Demo social connection" aria-label="Instagram">
                    <FiInstagram size={18} />
                  </span>
                  <span className="social-icon-link disabled" title="Demo social connection" aria-label="Facebook">
                    <FiFacebook size={18} />
                  </span>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-bottom-inner">
                <p className="footer-copy">
                  &copy; {new Date().getFullYear()} ExTask — Campus Task Exchange. All rights reserved.
                </p>
                <p className="footer-credit">
                  Built by <a 
                    href="https://www.linkedin.com/in/the-bhaumik-172b893b6/?isSelfProfile=false" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="credit-link"
                  >Bhaumik</a>
                </p>
              </div>
            </div>
          </Aurora>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
