import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((current) => !current)}
        onLogout={handleLogout}
        role={auth.role}
        name={auth.name}
      />
      <main className={`app-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="topbar">
          <div>
            <p className="eyebrow">Placement Ready Workspace</p>
            <h1>Student Grade Tracker</h1>
          </div>
          <div className="topbar-chip">{auth.role}</div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
