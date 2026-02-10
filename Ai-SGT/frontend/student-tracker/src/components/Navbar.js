import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/student/dashboard": "Student Dashboard",
    "/teacher/dashboard": "Teacher Dashboard",
    "/assignments": "Assignments",
    "/grades": "Grades",
    "/ai-predict": "AI Predictions",
    "/profile": "Profile"
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="page-title">
          <span className="title-acc">AI</span>
          <span>{title}</span>
        </div>
      </div>

      <div className="topbar-center">
        <div className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-.7.7l.3.3v.8L20 20.5 21.5 19l-6-5zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
          </svg>
          <input type="text" placeholder="Search assignments, grades, courses..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z" />
          </svg>
        </button>
        <div className="user-chip">
          <div className="avatar">
            {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="user-meta">
            <span className="user-name">{user?.name || user?.username}</span>
            <button className="user-link" onClick={() => navigate("/profile")}>
              View profile
            </button>
          </div>
          <button className="logout-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
