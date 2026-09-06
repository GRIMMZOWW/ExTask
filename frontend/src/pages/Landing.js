import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import BrandMedia from '../components/BrandMedia';
import FadeContent from '../components/FadeContent';
import ArrowButton from '../components/ArrowButton';
import SplitText from '../components/SplitText';
import ScrambledText from '../components/ScrambledText';
import GlareHover from '../components/GlareHover';
import StarBorder from '../components/StarBorder';
import ScrollExpand from '../components/ScrollExpand';
import DotField from '../components/DotField';
import AeroShards from '../components/AeroShards';
import { FiArrowRight, FiShield, FiSend, FiCheckCircle, FiDollarSign } from 'react-icons/fi';

function Landing() {
  const [openTasks, setOpenTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/tasks/getall?status=OPEN')
      .then(res => {
        setOpenTasks(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="landing-page page-transition">
      {/* IMMERSIVE FULL-VIEWPORT HERO — 100vh Edge-to-Edge with 2-Column Hero */}
      <BrandMedia variant="hero">
        <div className="hero-container">
          <div className="hero-left">
            <span className="brand-media-badge hero-badge">
              <ScrambledText text="CAMPUS TASK EXCHANGE" speed={30} maxIterations={6} animateOn="view" />
            </span>
            <SplitText
              text="Exchange Tasks. Get Things Done."
              tag="h1"
              className="hero-split-title"
              splitType="words"
              delay={60}
              duration={0.7}
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
            />
            <p className="brand-media-subtitle hero-subtitle-anim" style={{ marginTop: '12px', marginBottom: '0' }}>
              Post a task, find someone to take it on, and get it completed — from notes and practical work to coding, design, and more.
            </p>
            <div className="hero-cta-row" style={{ marginTop: '32px' }}>
              <StarBorder color="#2dd4bf" speed="4.5s" style={{ padding: '1px' }}>
                <ArrowButton to="/browse" variant="primary" className="hero-btn-primary" style={{ margin: 0 }}>
                  Browse Tasks
                </ArrowButton>
              </StarBorder>
              <ArrowButton to="/post" variant="secondary" className="hero-btn-secondary">Post a Task</ArrowButton>
            </div>
          </div>

          <div className="hero-right">
            <GlareHover maxTilt={6} glareMaxOpacity={0.14}>
              <div className="product-preview-panel">
                <div className="preview-panel-header">
                  <span className="panel-dot red"></span>
                  <span className="panel-dot yellow"></span>
                  <span className="panel-dot green"></span>
                  <span className="panel-title">campus-exchange-feed</span>
                </div>
                <div className="preview-tasks-list">
                  <div className="preview-task-item active">
                    <div className="preview-task-top">
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="status-badge badge-open">OPEN</span>
                        <span className="category-badge cat-notes">Notes</span>
                      </div>
                      <span className="preview-task-time">01</span>
                    </div>
                    <h4 className="preview-task-title">OS Unit 4 Exam Notes & Diagrams</h4>
                    <div className="preview-task-bottom">
                      <span className="preview-task-budget">500 INR</span>
                      <span className="preview-task-format">Direct Code</span>
                    </div>
                  </div>

                  <div className="preview-task-item">
                    <div className="preview-task-top">
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="status-badge badge-accepted">ACCEPTED</span>
                        <span className="category-badge cat-practical">Practical</span>
                      </div>
                      <span className="preview-task-time">02</span>
                    </div>
                    <h4 className="preview-task-title">Physics Lab Experiment Analysis</h4>
                    <div className="preview-task-bottom">
                      <span className="preview-task-budget">800 INR</span>
                      <span className="preview-task-format">Zip File</span>
                    </div>
                  </div>

                  <div className="preview-task-item">
                    <div className="preview-task-top">
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="status-badge badge-open">OPEN</span>
                        <span className="category-badge cat-coding">Coding</span>
                      </div>
                      <span className="preview-task-time">03</span>
                    </div>
                    <h4 className="preview-task-title">Spring Boot Security Integration</h4>
                    <div className="preview-task-bottom">
                      <span className="preview-task-budget">1500 INR</span>
                      <span className="preview-task-format">GitHub Link</span>
                    </div>
                  </div>

                  <div className="preview-task-item">
                    <div className="preview-task-top">
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="status-badge badge-paid">PAID</span>
                        <span className="category-badge cat-design">Design</span>
                      </div>
                      <span className="preview-task-time">04</span>
                    </div>
                    <h4 className="preview-task-title">Tech Fest Pitch Deck Presentation</h4>
                    <div className="preview-task-bottom">
                      <span className="preview-task-budget">1200 INR</span>
                      <span className="preview-task-format">Zip File</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </BrandMedia>

      {/* BODY CONTENT CONTAINER */}
      <div className="landing-content-container">
        {/* WORKFLOW RAIL */}
        <ScrollExpand>
          <FadeContent delay={100} direction="up" distance={16}>
            <section className="workflow-rail">
              <div className="workflow-step">
                <span className="step-num">01</span>
                <span className="step-label">POST</span>
              </div>
              <div className="workflow-connector" />
              <div className="workflow-step">
                <span className="step-num">02</span>
                <span className="step-label">ACCEPT</span>
              </div>
              <div className="workflow-connector" />
              <div className="workflow-step">
                <span className="step-num">03</span>
                <span className="step-label">SUBMIT</span>
              </div>
              <div className="workflow-connector" />
              <div className="workflow-step">
                <span className="step-num">04</span>
                <span className="step-label">COMPLETE</span>
              </div>
            </section>
          </FadeContent>
        </ScrollExpand>

        {/* MARKETPLACE PREVIEW */}
        <FadeContent delay={120} direction="up" distance={16}>
          <section className="preview-section" style={{ marginTop: '36px' }}>
            <div className="section-header-row">
              <div>
                <h2 className="section-heading">Tasks from your campus</h2>
                <p className="section-sub">Find work that needs doing, or post something you need help with.</p>
              </div>
              <Link to="/browse" className="see-all-link">
                View all tasks <FiArrowRight />
              </Link>
            </div>
            {loading ? (
              <div className="loading-spinner">Loading tasks...</div>
            ) : openTasks.length > 0 ? (
              <div className="tasks-grid">
                {openTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No open tasks right now. Be the first to post.</p>
                <ArrowButton to="/post" variant="primary">Post a Task</ArrowButton>
              </div>
            )}
          </section>
        </FadeContent>

        {/* TRUST SECTION WITH AMBIENT DOT FIELD & AERO SHARDS */}
        <ScrollExpand>
          <FadeContent delay={120} direction="up" distance={16}>
            <section className="trust-section" style={{ marginTop: '36px', position: 'relative', overflow: 'hidden' }}>
              <DotField gap={28} baseRadius={1.2} maxRadius={2.6} dotColor="rgba(148, 163, 184, 0.2)" glowColor="rgba(20, 184, 166, 0.6)" proximity={80} />
              <AeroShards count={4} />
              <div className="trust-inner" style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="section-heading">Payment only moves when the work is approved.</h2>
                <p className="section-sub" style={{ marginBottom: '36px' }}>Razorpay-secured transactions protect both posters and solvers.</p>
                <div className="trust-grid">
                  <div className="trust-item">
                    <FiSend className="trust-icon" />
                    <h4>Post</h4>
                    <p>A student defines the task and budget.</p>
                  </div>
                  <div className="trust-item">
                    <FiCheckCircle className="trust-icon" />
                    <h4>Submit</h4>
                    <p>Another student delivers the requested work.</p>
                  </div>
                  <div className="trust-item">
                    <FiShield className="trust-icon" />
                    <h4>Approve</h4>
                    <p>The poster reviews and approves the submission.</p>
                  </div>
                  <div className="trust-item">
                    <FiDollarSign className="trust-icon" />
                    <h4>Pay</h4>
                    <p>Razorpay completes the payment instantly.</p>
                  </div>
                </div>
              </div>
            </section>
          </FadeContent>
        </ScrollExpand>

        {/* FINAL CTA */}
        <FadeContent delay={120} direction="up" distance={16}>
          <section className="final-cta" style={{ marginTop: '36px' }}>
            <h2>Have something you need help with?</h2>
            <p>Post the task, find a solver, and get it completed.</p>
            <div className="hero-cta-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <StarBorder color="#2dd4bf" speed="4.5s">
                <ArrowButton to="/post" variant="primary" style={{ margin: 0 }}>Post a Task</ArrowButton>
              </StarBorder>
              <ArrowButton to="/browse" variant="secondary">Browse Tasks</ArrowButton>
            </div>
          </section>
        </FadeContent>
      </div>
    </div>
  );
}

export default Landing;
