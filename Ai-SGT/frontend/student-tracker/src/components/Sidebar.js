import React from "react";
import { NavLink } from "react-router-dom";

const Icon = ({ name }) => {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z" />
        </svg>
      );
    case "assignments":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 4h10V4H7v2zm0 5h10V9H7v2zm0 5h7v-2H7v2z" />
        </svg>
      );
    case "grades":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M4 19h3V9H4v10zm6 0h3V5h-3v14zm6 0h3v-7h-3v7z" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M7 7h2V5a3 3 0 0 1 6 0v2h2v2h-2v2h2v2h-2v2h-2v-2H11v2H9v-2H7v-2h2V9H7V7zm4 2v4h2V9h-2z" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Sidebar({ open, onToggle, onLogout, role }) {
  const dashboardRoute = role === "INSTRUCTOR" ? "/teacher/dashboard" : "/student/dashboard";
  const menuItems = [
    { label: "Dashboard", route: dashboardRoute, icon: "dashboard" },
    { label: "Assignments", route: "/assignments", icon: "assignments" },
    { label: "Grades", route: "/grades", icon: "grades" },
    { label: "AI Predictions", route: "/ai-predict", icon: "ai" },
    { label: "Profile", route: "/profile", icon: "profile" }
  ];

  return (
    <aside className={`app-sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="brand">
          <span className="brand-mark">SGT</span>
          {open && <span className="brand-sub">Student Tracker</span>}
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.route} to={item.route} className="sidebar-link">
            <Icon name={item.icon} />
            {open && <span className="link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <path d="M10 17l1.4-1.4L9.8 14H20v-2H9.8l1.6-1.6L10 9l-4 4 4 4zM4 4h8V2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8v-2H4V4z" />
          </svg>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
