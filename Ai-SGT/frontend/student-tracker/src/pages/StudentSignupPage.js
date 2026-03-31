import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";
import "../styles/auth.css";

const INITIAL = {
  name: "", username: "", email: "",
  department: "", year: "",
  password: "", confirmPassword: "",
};

export default function StudentSignupPage() {
  const [form,    setForm]    = useState(INITIAL);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signupUser({
        username:   form.username,
        email:      form.email,
        password:   form.password,
        role:       "STUDENT",
        name:       form.name,
        department: form.department,
        year:       parseInt(form.year) || 1,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card auth-card-wide">
        {/* Logo */}
        <div className="auth-logo">SGT</div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Student Tracker as a student</p>

        {error && (
          <div className="auth-error" style={{ marginBottom: 16 }}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name + Username */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                name="name"
                type="text"
                className="auth-input"
                placeholder="Raj Kumar"
                value={form.name}
                onChange={handle}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                name="username"
                type="text"
                className="auth-input"
                placeholder="raj123"
                value={form.username}
                onChange={handle}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              name="email"
              type="email"
              className="auth-input"
              placeholder="raj@example.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>

          {/* Department + Year */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Department</label>
              <input
                name="department"
                type="text"
                className="auth-input"
                placeholder="e.g. IT, CSE"
                value={form.department}
                onChange={handle}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Year</label>
              <select
                name="year"
                className="auth-select"
                value={form.year}
                onChange={handle}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                name="password"
                type="password"
                className="auth-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handle}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handle}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" /> Creating Account…</>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}