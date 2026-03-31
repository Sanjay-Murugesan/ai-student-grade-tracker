import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (auth.isAuthenticated) {
    return <Navigate to={auth.isTeacher() ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const payload = await auth.register(form);
      navigate(payload.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">New Workspace</p>
        <h1>Create your account</h1>
        <p>Register as a student or teacher and land on the correct dashboard automatically.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ava Sharma"
              required
            />
          </label>
          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              placeholder="name@demo.com"
              required
            />
          </label>
          <label>
            Password
            <input
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              placeholder="Choose a secure password"
              required
            />
          </label>

          <div className="role-toggle">
            {["STUDENT", "TEACHER"].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-option ${form.role === role ? "active" : ""}`}
                onClick={() => setForm((current) => ({ ...current, role }))}
              >
                {role}
              </button>
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <button className="link-button" type="button" onClick={() => navigate("/login")}>
          Back to login
        </button>
      </div>
    </div>
  );
}
