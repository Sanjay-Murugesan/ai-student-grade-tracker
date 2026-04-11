import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";
import "../styles/auth.css";

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    department: "",
    year: ""
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
      await signupUser({
        ...formData,
        role: "STUDENT",
        year: parseInt(formData.year)
      });
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
        <div className="auth-box">
          <h2>Student Sign Up</h2>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />

            <input name="department" placeholder="Department" onChange={handleChange} />

            <select name="year" onChange={handleChange}>
              <option value="">Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <button className="auth-btn">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Already have account?</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" />
      </div>

    </div>
  );
};

export default StudentSignupPage;