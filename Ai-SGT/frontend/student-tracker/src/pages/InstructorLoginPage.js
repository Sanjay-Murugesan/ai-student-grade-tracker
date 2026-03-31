import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

export default function InstructorLoginPage() {
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const navigate  = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response        = await loginUser(username, password, "INSTRUCTOR");
      const { token, user } = response.data;
      login(user, token);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">SGT</div>

        {/* Instructor badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <span style={{
            background: "rgba(13,148,136,0.1)",
            color: "#0d9488",
            border: "1px solid rgba(13,148,136,0.25)",
            borderRadius: 999,
            padding: "3px 14px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}>
            INSTRUCTOR ACCESS
          </span>
        </div>

        <h1 className="auth-title">Instructor Login</h1>
        <p className="auth-subtitle">Sign in to manage students and grades</p>

        {error && (
          <div className="auth-error" style={{ marginBottom: 16 }}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-show-btn"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" /> Signing in…</>
            ) : (
              "Sign In as Instructor"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/instructor-signup" className="auth-link">Sign up</Link>
          </p>
          <div className="auth-divider" />
          <Link to="/login" className="auth-link">
            ← Back to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}