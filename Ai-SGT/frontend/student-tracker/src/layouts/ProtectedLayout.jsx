import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import "../styles/shell.css";

export default function ProtectedLayout() {
  const { logout, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onLogout={logout}
        role={user?.role}
      />

      <section className={`app-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Navbar />
        <div className="app-content">
          <Outlet />
        </div>
        <Footer />s
      </section>
    </div>
  );
}
