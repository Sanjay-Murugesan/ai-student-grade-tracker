import React from "react";
import "../styles/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about-section">
          <div className="footer-logo">
            <div className="logo-icon">SGT</div>
            <div className="logo-text">Student Tracker</div>
          </div>
          <p className="about-text">
            Track progress, manage assignments, and stay on top of grades with a
            clean, focused dashboard built for students and instructors.
          </p>
          <button type="button" className="learn-more-btn">
            Learn more
          </button>
        </div>

        <div className="footer-section">
          <div className="footer-title">Product</div>
          <ul className="footer-links">
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/assignments">Assignments</a>
            </li>
            <li>
              <a href="/grades">Grades</a>
            </li>
            <li>
              <a href="/ai-predict">AI Predictions</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="footer-title">Support</div>
          <ul className="footer-links">
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              <a href="/help">Help Center</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section follow-section">
          <div className="footer-title">Follow</div>
          <div className="social-icons">
            <a className="social-icon" href="https://github.com" aria-label="GitHub">
              GH
            </a>
            <a className="social-icon" href="https://twitter.com" aria-label="Twitter">
              TW
            </a>
            <a className="social-icon" href="https://linkedin.com" aria-label="LinkedIn">
              IN
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>Privacy</span>
          <span className="divider">|</span>
          <span>Terms</span>
          <span className="divider">|</span>
          <span>Accessibility</span>
        </div>
        <div className="footer-copyright">
          Copyright {year} Student Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
