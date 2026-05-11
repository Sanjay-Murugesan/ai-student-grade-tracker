import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const StudentIllustration = () => (
  <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* desk */}
    <rect x="30" y="220" width="260" height="14" rx="7" fill="#1a3a4a" opacity="0.9"/>
    <rect x="60" y="234" width="14" height="50" rx="7" fill="#1a3a4a" opacity="0.7"/>
    <rect x="246" y="234" width="14" height="50" rx="7" fill="#1a3a4a" opacity="0.7"/>

    {/* laptop screen */}
    <rect x="80" y="130" width="160" height="100" rx="8" fill="#0d2233"/>
    <rect x="85" y="135" width="150" height="90" rx="5" fill="#0a1a2a"/>
    {/* screen glow */}
    <rect x="85" y="135" width="150" height="90" rx="5" fill="url(#screenGrad)" opacity="0.7"/>
    {/* code lines on screen */}
    <rect x="96" y="148" width="60" height="5" rx="2.5" fill="#38d9a9" opacity="0.8"/>
    <rect x="96" y="158" width="90" height="5" rx="2.5" fill="#4f8ef7" opacity="0.6"/>
    <rect x="96" y="168" width="45" height="5" rx="2.5" fill="#38d9a9" opacity="0.5"/>
    <rect x="96" y="178" width="75" height="5" rx="2.5" fill="#4f8ef7" opacity="0.4"/>
    <rect x="96" y="188" width="55" height="5" rx="2.5" fill="#38d9a9" opacity="0.6"/>
    <rect x="96" y="198" width="80" height="5" rx="2.5" fill="#4f8ef7" opacity="0.5"/>
    {/* cursor blink */}
    <rect x="158" y="198" width="6" height="5" rx="1" fill="#fff" opacity="0.9"/>

    {/* laptop base */}
    <rect x="72" y="228" width="176" height="10" rx="5" fill="#1a3a4a"/>
    {/* hinge */}
    <rect x="145" y="225" width="30" height="6" rx="3" fill="#0d2233"/>

    {/* book stack left */}
    <rect x="34" y="195" width="46" height="8" rx="4" fill="#38d9a9" opacity="0.7"/>
    <rect x="36" y="189" width="42" height="8" rx="4" fill="#4f8ef7" opacity="0.7"/>
    <rect x="38" y="183" width="38" height="8" rx="4" fill="#a78bfa" opacity="0.6"/>

    {/* coffee mug right */}
    <rect x="240" y="196" width="30" height="26" rx="5" fill="#1a3a4a"/>
    <path d="M270 205 Q280 205 280 212 Q280 219 270 219" stroke="#1a3a4a" stroke-width="5" fill="none"/>
    <rect x="243" y="192" width="24" height="5" rx="2.5" fill="#0d2233" opacity="0.6"/>
    {/* steam */}
    <path d="M250 185 Q253 180 250 175" stroke="#38d9a9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M258 183 Q261 178 258 173" stroke="#38d9a9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>

    {/* student figure */}
    {/* head */}
    <circle cx="160" cy="68" r="28" fill="#f4c49e"/>
    {/* hair */}
    <path d="M132 62 Q135 38 160 36 Q185 38 188 62 Q180 50 160 50 Q140 50 132 62Z" fill="#3d2b1f"/>
    {/* body */}
    <rect x="138" y="94" width="44" height="50" rx="12" fill="#4f8ef7"/>
    {/* collar */}
    <path d="M152 96 L160 108 L168 96" fill="#fff" opacity="0.15"/>
    {/* arms */}
    <path d="M138 100 Q118 115 114 138" stroke="#f4c49e" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M182 100 Q202 115 206 138" stroke="#f4c49e" stroke-width="13" stroke-linecap="round" fill="none"/>
    {/* hands */}
    <circle cx="113" cy="140" r="8" fill="#f4c49e"/>
    <circle cx="206" cy="140" r="8" fill="#f4c49e"/>
    {/* face */}
    <circle cx="151" cy="68" r="4" fill="#3d2b1f" opacity="0.8"/>
    <circle cx="169" cy="68" r="4" fill="#3d2b1f" opacity="0.8"/>
    <path d="M152 78 Q160 84 168 78" stroke="#c0825a" stroke-width="2" fill="none" stroke-linecap="round"/>
    {/* glasses */}
    <rect x="142" y="62" width="14" height="10" rx="4" stroke="#38d9a9" stroke-width="1.5" fill="none" opacity="0.8"/>
    <rect x="163" y="62" width="14" height="10" rx="4" stroke="#38d9a9" stroke-width="1.5" fill="none" opacity="0.8"/>
    <line x1="156" y1="67" x2="163" y2="67" stroke="#38d9a9" stroke-width="1.5" opacity="0.8"/>
    <line x1="142" y1="67" x2="136" y2="65" stroke="#38d9a9" stroke-width="1.5" opacity="0.6"/>
    <line x1="177" y1="67" x2="183" y2="65" stroke="#38d9a9" stroke-width="1.5" opacity="0.6"/>

    {/* floating grade badge */}
    <rect x="210" y="58" width="68" height="36" rx="10" fill="#0d2233" opacity="0.9"/>
    <text x="244" y="73" textAnchor="middle" fontSize="11" fill="#38d9a9" fontWeight="600">Grade A+</text>
    <text x="244" y="86" textAnchor="middle" fontSize="9" fill="#4f8ef7" opacity="0.8">95 / 100</text>

    {/* floating notification */}
    <rect x="42" y="58" width="60" height="30" rx="8" fill="#0d2233" opacity="0.9"/>
    <text x="72" y="71" textAnchor="middle" fontSize="9" fill="#a78bfa">Assignment</text>
    <text x="72" y="82" textAnchor="middle" fontSize="9" fill="#38d9a9" fontWeight="600">Submitted ✓</text>

    <defs>
      <linearGradient id="screenGrad" x1="85" y1="135" x2="235" y2="225" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38d9a9" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
  </svg>
);

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(email, password, "STUDENT");
      const { token, user } = response.data;
      login(user, token);
      navigate("/student/dashboard");
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
        <div style={{ width: "72%", maxWidth: 360, position: "relative", zIndex: 1, animation: "floatIll 6s ease-in-out infinite" }}>
          <StudentIllustration />
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 24 }}>
          <h3 style={{ fontFamily: "'Lora', serif", fontSize: "1.35rem", fontWeight: 600, color: "#f0f2f5", margin: "0 0 6px" }}>
            Track Your Progress
          </h3>
          <p style={{ fontSize: "0.82rem", color: "rgba(240,242,245,0.45)", margin: 0, maxWidth: 240 }}>
            View grades, assignments and AI-powered insights in one place.
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="auth-right">
        <div className="auth-box">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 18, background: "rgba(56,217,169,0.1)", color: "#38d9a9", border: "1px solid rgba(56,217,169,0.2)" }}>
            ● Student Portal
          </div>
          <h2>Welcome back</h2>
          <p style={{ fontSize: "0.84rem", color: "rgba(240,242,245,0.45)", marginTop: 4, marginBottom: 30 }}>
            Please enter your credentials to continue.
          </p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <button className="auth-btn">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-links">
            <p><Link to="/signup">Don't have an account? Sign up</Link></p>
            <p><Link to="/instructor-login">Instructor Login →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;