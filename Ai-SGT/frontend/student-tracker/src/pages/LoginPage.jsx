import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (auth.isAuthenticated) {
    return <Navigate to={auth.isTeacher() ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const payload = await auth.login(form.email, form.password);
      const fallback = payload.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">Placement Ready Login</p>
        <h1>Welcome back</h1>
        <p>Sign in to access your student or teacher workspace.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              placeholder="teacher1@demo.com or student1@demo.com"
              required
            />
          </label>
          <label>
            Password
            <input
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              placeholder="teacher@123 or student@123"
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <button className="link-button" type="button" onClick={() => navigate("/register")}>
          Create an account
        </button>
      </div>
    </div>
  );
}
