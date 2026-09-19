// ═══════════════════════════════════════════
// StudentSignupPage.js
// ═══════════════════════════════════════════
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";
import "../styles/auth.css";

const StudentSignupIllustration = () => (
  <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* open book */}
    <rect x="55" y="120" width="95" height="115" rx="6" fill="#0d2233"/>
    <rect x="170" y="120" width="95" height="115" rx="6" fill="#0a1928"/>
    <rect x="58" y="123" width="89" height="109" rx="4" fill="#0f2840"/>
    <rect x="173" y="123" width="89" height="109" rx="4" fill="#0a1928"/>
    {/* spine */}
    <rect x="150" y="118" width="20" height="120" rx="4" fill="#1a3a4a"/>
    {/* lines on left page */}
    <rect x="65" y="135" width="70" height="4" rx="2" fill="#38d9a9" opacity="0.5"/>
    <rect x="65" y="145" width="55" height="4" rx="2" fill="#4f8ef7" opacity="0.4"/>
    <rect x="65" y="155" width="65" height="4" rx="2" fill="#38d9a9" opacity="0.35"/>
    <rect x="65" y="165" width="50" height="4" rx="2" fill="#4f8ef7" opacity="0.3"/>
    <rect x="65" y="175" width="60" height="4" rx="2" fill="#38d9a9" opacity="0.4"/>
    <rect x="65" y="185" width="45" height="4" rx="2" fill="#4f8ef7" opacity="0.35"/>
    {/* graph on right page */}
    <rect x="180" y="185" width="14" height="30" rx="3" fill="#4f8ef7" opacity="0.6"/>
    <rect x="200" y="170" width="14" height="45" rx="3" fill="#38d9a9" opacity="0.7"/>
    <rect x="220" y="160" width="14" height="55" rx="3" fill="#a78bfa" opacity="0.65"/>
    <rect x="240" y="175" width="14" height="40" rx="3" fill="#4f8ef7" opacity="0.6"/>
    <line x1="178" y1="217" x2="258" y2="217" stroke="rgba(240,242,245,0.15)" strokeWidth="1"/>

    {/* student — standing/reading */}
    {/* head */}
    <circle cx="160" cy="62" r="26" fill="#f4c49e"/>
    {/* hair */}
    <path d="M134 56 Q138 34 160 32 Q182 34 186 56 Q178 44 160 44 Q142 44 134 56Z" fill="#5c3d2e"/>
    {/* body */}
    <rect x="141" y="86" width="38" height="44" rx="10" fill="#38d9a9" opacity="0.9"/>
    {/* arms holding book */}
    <path d="M141 95 Q122 108 115 122" stroke="#f4c49e" strokeWidth="12" strokeLinecap="round" fill="none"/>
    <circle cx="113" cy="124" r="7" fill="#f4c49e"/>
    <path d="M179 95 Q198 108 205 122" stroke="#f4c49e" strokeWidth="12" strokeLinecap="round" fill="none"/>
    <circle cx="207" cy="124" r="7" fill="#f4c49e"/>
    {/* small book in hands */}
    <rect x="105" y="120" width="30" height="22" rx="3" fill="#a78bfa" opacity="0.9"/>
    <rect x="200" y="120" width="16" height="22" rx="3" fill="#4f8ef7" opacity="0.7"/>
    {/* face */}
    <circle cx="152" cy="62" r="3.5" fill="#3d2b1f" opacity="0.85"/>
    <circle cx="168" cy="62" r="3.5" fill="#3d2b1f" opacity="0.85"/>
    <path d="M153 72 Q160 77 167 72" stroke="#c0825a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

    {/* floating elements */}
    <rect x="20" y="50" width="66" height="32" rx="8" fill="#0d2233" opacity="0.92"/>
    <text x="53" y="63" textAnchor="middle" fontSize="9" fill="#38d9a9">New Course</text>
    <text x="53" y="75" textAnchor="middle" fontSize="9" fill="#f0f2f5" fontWeight="600">Enrolled!</text>

    <rect x="234" y="50" width="66" height="32" rx="8" fill="#0d2233" opacity="0.92"/>
    <text x="267" y="63" textAnchor="middle" fontSize="9" fill="#4f8ef7">GPA</text>
    <text x="267" y="75" textAnchor="middle" fontSize="13" fill="#f0f2f5" fontWeight="700">3.8</text>

    {/* pencil decoration */}
    <rect x="270" y="140" width="8" height="70" rx="4" fill="#f4c49e" opacity="0.6" transform="rotate(20 274 175)"/>
    <polygon points="270,200 278,200 274,212" fill="#f4c49e" opacity="0.4" transform="rotate(20 274 206)"/>
  </svg>
);

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    name: "", department: "", year: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signupUser({ ...formData, role: "STUDENT", year: parseInt(formData.year) });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div style={{ width: "76%", maxWidth: 360, position: "relative", zIndex: 1, animation: "floatIll 6s ease-in-out infinite" }}>
          <StudentSignupIllustration />
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 16 }}>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: "1.3rem", fontWeight: 600, color: "#f0f2f5", margin: "0 0 5px" }}>
            Start Your Journey
          </h3>
          <p style={{ fontSize: "0.81rem", color: "rgba(240,242,245,0.45)", margin: 0, maxWidth: 230 }}>
            Join thousands of students tracking their academic growth.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 16, background: "rgba(56,217,169,0.1)", color: "#38d9a9", border: "1px solid rgba(56,217,169,0.2)" }}>
            ● Student Portal
          </div>
          <h2>Create account</h2>
          <p style={{ fontSize: "0.84rem", color: "rgba(240,242,245,0.45)", marginTop: 4, marginBottom: 26 }}>
            Fill in your details to get started.
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email address" onChange={handleChange} required />
            <input name="department" placeholder="Department" onChange={handleChange} />
            <select name="year" onChange={handleChange}>
              <option value="">Select Year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
            <button className="auth-btn">
              {loading ? "Creating…" : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <p><Link to="/login">Already have an account? Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupPage;