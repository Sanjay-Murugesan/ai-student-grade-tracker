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

    case "attendance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14v10zM7 11h5v5H7v-5z" />
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

    case "notifications":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z" />
        </svg>
      );

    case "analytics":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M5 20h14v-2H5v2zm1-4h2V8H6v8zm5 0h2V4h-2v12zm5 0h2v-6h-2v6z" />
        </svg>
      );

    case "submissions":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5" />
        </svg>
      );

    case "students":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      );

    default:
      return null;
  }
};

export default function Sidebar({
  open,
  onToggle,
  onLogout,
  role,
}) {

  const dashboardRoute =
    role === "INSTRUCTOR"
      ? "/teacher/dashboard"
      : "/student/dashboard";

  // ================= COMMON MENU =================

  const commonItems = [

    {
      label: "Dashboard",
      route: dashboardRoute,
      icon: "dashboard",
    },

    {
      label: "Assignments",
      route: "/assignments",
      icon: "assignments",
    },

    {
      label: "Grades",
      route: "/grades",
      icon: "grades",
    },

    {
      label: "Attendance",
      route: "/attendance",
      icon: "attendance",
    },

    {
      label: "AI Predict",
      route: "/ai-predict",
      icon: "ai",
    },

    {
      label: "AI Insights",
      route: "/ai-insights",
      icon: "analytics",
    },

    {
      label: "Notifications",
      route: "/notifications",
      icon: "notifications",
    },
  ];

  // ================= INSTRUCTOR ONLY =================

  const instructorItems =
    role === "INSTRUCTOR"
      ? [

          {
            label: "Students",
            route: "/teacher/students",
            icon: "students",
          },

          {
            label: "Submissions",
            route: "/teacher/submissions",
            icon: "submissions",
          },

          {
            label: "Course Analytics",
            route: "/course-analytics",
            icon: "analytics",
          },
        ]
      : [];

  // ================= FINAL MENU =================

  const menuItems = [

    ...commonItems,

    ...instructorItems,

    {
      label: "Profile",
      route: "/profile",
      icon: "profile",
    },
  ];

  return (

    <aside
      className={`app-sidebar ${open ? "open" : "closed"}`}
    >

      {/* ================= HEADER ================= */}

      <div className="sidebar-header">

        <div className="brand">

          <span className="brand-mark">
            SGT
          </span>

          {open && (
            <span className="brand-sub">
              Student Tracker
            </span>
          )}

        </div>

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >

          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>

        </button>

      </div>

      {/* ================= NAVIGATION ================= */}

      <nav className="sidebar-nav">

        {menuItems.map((item) => (

          <NavLink
            key={item.route}
            to={item.route}
            className="sidebar-link"
          >

            <Icon name={item.icon} />

            {open && (
              <span className="link-label">
                {item.label}
              </span>
            )}

          </NavLink>

        ))}

      </nav>

      {/* ================= FOOTER ================= */}

      <div className="sidebar-footer">

        <button
          className="logout-btn"
          onClick={onLogout}
        >

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="icon"
          >

            <path d="M10 17l1.4-1.4L9.8 14H20v-2H9.8l1.6-1.6L10 9l-4 4 4 4zM4 4h8V2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8v-2H4V4z" />

          </svg>

          {open && <span>Logout</span>}

        </button>

      </div>

    </aside>
  );
}