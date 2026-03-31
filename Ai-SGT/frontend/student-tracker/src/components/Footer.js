import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Brand col */}
        <div>
          <div className="footer-brand-mark">SGT</div>
          <div className="footer-brand-name">Student Tracker</div>
          <p className="footer-desc">
            Track progress, manage assignments, and stay on top of grades
            with a clean, focused dashboard built for students and instructors.
          </p>
          <button className="footer-learn-btn" onClick={() => navigate("/student/dashboard")}>
            Learn more
          </button>
        </div>

        {/* Product col */}
        <div className="footer-col">
          <h6>Product</h6>
          <button onClick={() => navigate("/student/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/assignments")}>Assignments</button>
          <button onClick={() => navigate("/grades")}>Grades</button>
          <button onClick={() => navigate("/ai-predict")}>AI Predictions</button>
        </div>

        {/* Support col */}
        <div className="footer-col">
          <h6>Support</h6>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <a href="#settings">Settings</a>
          <a href="#help">Help Center</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Follow col */}
        <div className="footer-col">
          <h6>Follow</h6>
          <div className="footer-social">
            <button className="social-btn" aria-label="GitHub">GH</button>
            <button className="social-btn" aria-label="Twitter">TW</button>
            <button className="social-btn" aria-label="LinkedIn">IN</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy</a>
          <span className="sep">|</span>
          <a href="#terms">Terms</a>
          <span className="sep">|</span>
          <a href="#accessibility">Accessibility</a>
        </div>
        <span className="footer-copy">
          Copyright {new Date().getFullYear()} Student Tracker. All rights reserved.
        </span>
      </div>
    </footer>
  );
}