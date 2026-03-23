import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/shell.css";

const pageTitles = {
  "/student/dashboard": "Student Dashboard",
  "/teacher/dashboard": "Teacher Dashboard",
  "/assignments": "Assignments",
  "/grades": "Grades",
  "/ai-predict": "AI Predictions",
  "/ai-insights": "AI Insights",
  "/notifications": "Notifications",
  "/course-analytics": "Course Analytics",
  "/profile": "Profile",
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Dashboard";
  const initials = (user?.name || user?.username || "U").charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login");
  }

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
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input type="text" placeholder="Search assignments, grades, courses..." aria-label="Search" />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications" onClick={() => navigate("/notifications")}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>

        <div className="user-chip" onClick={() => navigate("/profile")}>
          <div className="avatar">{initials}</div>
          <div className="user-meta">
            <span className="user-name">{user?.name || user?.username}</span>
            <button
              className="user-link"
              onClick={(event) => {
                event.stopPropagation();
                navigate("/profile");
              }}
            >
              View profile
            </button>
          </div>
        </div>

        <button className="logout-link" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
