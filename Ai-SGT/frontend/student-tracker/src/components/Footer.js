import React from "react";
import "../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                {/* About Us Section */}
                <div className="footer-section about-section">
                    <div className="footer-logo">
                        <div className="logo-icon">🧠</div>
                        <span className="logo-text">SGT</span>
                    </div>
                    <p className="about-text">
                        Student Growth Tracker (SGT) helps you manage your academic journey, track grades,
                        and receive AI-powered predictions to enhance your learning experience.
                    </p>
                    <button className="learn-more-btn">Learn More</button>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="#my-account">My Account</a></li>
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#courses">Courses</a></li>
                        <li><a href="#grades">Grades</a></li>
                        <li><a href="#schedule">Schedule</a></li>
                    </ul>
                </div>

                {/* Support Section */}
                <div className="footer-section">
                    <h4 className="footer-title">Support</h4>
                    <ul className="footer-links">
                        <li><a href="#tech-support">Tech Support</a></li>
                        <li><a href="#documentation">Documentation</a></li>
                        <li><a href="#faq">F.A.Q.</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#feedback">Send Feedback</a></li>
                    </ul>
                </div>

                {/* Follow Us Section */}
                <div className="footer-section follow-section">
                    <h4 className="footer-title">Follow Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                            <i className="fab fa-facebook-f">f</i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                            <i className="fab fa-twitter">𝕏</i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                            <i className="fab fa-instagram">📷</i>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                            <i className="fab fa-youtube">▶</i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span>Privacy Policy</span>
                    <span className="divider">|</span>
                    <span>Terms & Conditions</span>
                    <span className="divider">|</span>
                    <span>Cookies</span>
                </div>
                <div className="footer-copyright">
                    © 2026 Student Growth Tracker. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
