import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard" },
  { to: "/student/grades", label: "My Grades" },
  { to: "/student/assignments", label: "Assignments" },
];

const teacherLinks = [
  { to: "/teacher/dashboard", label: "Dashboard" },
  { to: "/teacher/roster", label: "Student Roster" },
  { to: "/teacher/grades", label: "Grade Management" },
  { to: "/teacher/assignments", label: "Assignments" },
];

export default function Sidebar({ open, onToggle, onLogout, role, name }) {
  const links = role === "TEACHER" ? teacherLinks : studentLinks;

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      <div className="sidebar-brand">
        <button className="toggle-button" onClick={onToggle} type="button">
          {open ? "<<" : ">>"}
        </button>
        {open && (
          <div>
            <div className="brand-kicker">SGT</div>
            <h2>Tracker OS</h2>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            {open ? link.label : link.label.charAt(0)}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {open && (
          <>
            <div className="profile-name">{name}</div>
            <div className={`role-pill ${role === "TEACHER" ? "teacher" : "student"}`}>{role}</div>
          </>
        )}
        <button className="logout-button" onClick={onLogout} type="button">
          {open ? "Logout" : "X"}
        </button>
      </div>
    </aside>
  );
}
