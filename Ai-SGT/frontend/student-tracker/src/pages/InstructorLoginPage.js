import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const TeacherIllustration = () => (
  <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* whiteboard */}
    <rect x="40" y="40" width="240" height="155" rx="10" fill="#0d2233"/>
    <rect x="46" y="46" width="228" height="143" rx="7" fill="#0a1928"/>
    {/* board tray */}
    <rect x="40" y="192" width="240" height="10" rx="3" fill="#1a3a4a"/>

    {/* board content — chart */}
    <text x="160" y="70" textAnchor="middle" fontSize="11" fill="rgba(240,242,245,0.35)" fontFamily="Plus Jakarta Sans, sans-serif">Class Performance</text>
    {/* bar chart */}
    <rect x="70" y="140" width="22" height="35" rx="3" fill="#4f8ef7" opacity="0.7"/>
    <rect x="100" y="120" width="22" height="55" rx="3" fill="#38d9a9" opacity="0.8"/>
    <rect x="130" y="105" width="22" height="70" rx="3" fill="#4f8ef7" opacity="0.6"/>
    <rect x="160" y="130" width="22" height="45" rx="3" fill="#38d9a9" opacity="0.5"/>
    <rect x="190" y="95" width="22" height="80" rx="3" fill="#a78bfa" opacity="0.7"/>
    <rect x="220" y="115" width="22" height="60" rx="3" fill="#4f8ef7" opacity="0.8"/>
    {/* x axis */}
    <line x1="60" y1="176" x2="252" y2="176" stroke="rgba(240,242,245,0.15)" strokeWidth="1"/>
    {/* trend line */}
    <polyline points="81,147 111,132 141,118 171,142 201,108 231,128" stroke="#38d9a9" strokeWidth="1.5" fill="none" strokeDasharray="4 2" opacity="0.6"/>

    {/* board stand */}
    <line x1="130" y1="202" x2="110" y2="260" stroke="#1a3a4a" strokeWidth="8" strokeLinecap="round"/>
    <line x1="190" y1="202" x2="210" y2="260" stroke="#1a3a4a" strokeWidth="8" strokeLinecap="round"/>
    <line x1="100" y1="260" x2="220" y2="260" stroke="#1a3a4a" strokeWidth="6" strokeLinecap="round"/>

    {/* teacher figure — right side */}
    {/* head */}
    <circle cx="272" cy="106" r="24" fill="#e8b89a"/>
    {/* hair bun */}
    <circle cx="272" cy="84" r="14" fill="#3d2b1f"/>
    <circle cx="285" cy="86" r="8" fill="#3d2b1f"/>
    {/* body */}
    <rect x="252" y="128" width="40" height="46" rx="10" fill="#4f8ef7"/>
    {/* collar detail */}
    <path d="M264 130 L272 142 L280 130" fill="#fff" opacity="0.12"/>
    {/* left arm — pointing at board */}
    <path d="M252 138 Q230 148 210 162" stroke="#e8b89a" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <circle cx="208" cy="163" r="7" fill="#e8b89a"/>
    {/* pointer stick */}
    <line x1="206" y1="165" x2="180" y2="152" stroke="#38d9a9" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="178" cy="151" r="3" fill="#38d9a9"/>
    {/* right arm */}
    <path d="M292 138 Q300 155 298 172" stroke="#e8b89a" strokeWidth="11" strokeLinecap="round" fill="none"/>
    <circle cx="298" cy="174" r="7" fill="#e8b89a"/>
    {/* book in right hand */}
    <rect x="292" y="170" width="22" height="28" rx="4" fill="#a78bfa" opacity="0.8"/>
    <line x1="303" y1="174" x2="303" y2="194" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>

    {/* face */}
    <circle cx="264" cy="106" r="3.5" fill="#3d2b1f" opacity="0.8"/>
    <circle cx="280" cy="106" r="3.5" fill="#3d2b1f" opacity="0.8"/>
    <path d="M265 115 Q272 120 279 115" stroke="#c0825a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

    {/* floating badge */}
    <rect x="22" y="72" width="72" height="38" rx="9" fill="#0d2233" opacity="0.92"/>
    <text x="58" y="87" textAnchor="middle" fontSize="9" fill="#a78bfa">Students</text>
    <text x="58" y="101" textAnchor="middle" fontSize="13" fill="#f0f2f5" fontWeight="700">42</text>

    {/* floating star */}
    <rect x="22" y="118" width="72" height="38" rx="9" fill="#0d2233" opacity="0.92"/>
    <text x="58" y="133" textAnchor="middle" fontSize="9" fill="#38d9a9">Avg Score</text>
    <text x="58" y="147" textAnchor="middle" fontSize="13" fill="#f0f2f5" fontWeight="700">87%</text>

    <defs>
      <linearGradient id="boardGrad" x1="40" y1="40" x2="280" y2="195" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38d9a9" stopOpacity="0.05"/>
        <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.05"/>
      </linearGradient>
    </defs>
  </svg>
);

const InstructorLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(username, password, "INSTRUCTOR");
      const { token, user } = response.data;
      login(user, token);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT — illustration */}
      <div className="auth-left">
        <div style={{ width: "80%", maxWidth: 380, position: "relative", zIndex: 1, animation: "floatIll 7s ease-in-out infinite" }}>
          <TeacherIllustration />
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 20 }}>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: "1.35rem", fontWeight: 600, color: "#f0f2f5", margin: "0 0 6px" }}>
            Manage Your Classroom
          </h3>
          <p style={{ fontSize: "0.82rem", color: "rgba(240,242,245,0.45)", margin: 0, maxWidth: 240 }}>
            Publish assignments, track attendance and view analytics.
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="auth-right">
        <div className="auth-box">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 18, background: "rgba(79,142,247,0.1)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.2)" }}>
            ● Instructor Portal
          </div>
          <h2>Welcome back</h2>
          <p style={{ fontSize: "0.84rem", color: "rgba(240,242,245,0.45)", marginTop: 4, marginBottom: 30 }}>
            Please enter your credentials to continue.
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="auth-btn">
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <p><Link to="/instructor-signup">Don't have an account? Sign up</Link></p>
            <p><Link to="/login">Student Login →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLoginPage;