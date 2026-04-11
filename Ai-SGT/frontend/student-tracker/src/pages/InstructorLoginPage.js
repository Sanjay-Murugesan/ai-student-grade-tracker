import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

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

      <div className="auth-left">
        <div className="auth-box">
          <h2>Instructor Login</h2>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Username"
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
              {loading ? "Logging..." : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/instructor-signup">Sign up</Link>
            <br />
            <Link to="/login">Student Login</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <img src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png" />
      </div>

    </div>
  );
};

export default InstructorLoginPage;