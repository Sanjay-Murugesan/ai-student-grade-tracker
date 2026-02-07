import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getGradesByStudent, getCourses } from "../services/api";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [averageGrade, setAverageGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const coursesRes = await getCourses();
      setCourses(coursesRes.data || []);

      const gradesRes = await getGradesByStudent(user.id);
      const gradesData = Array.isArray(gradesRes.data) ? gradesRes.data : [];
      setGrades(gradesData);

      const avg =
        gradesData.length > 0
          ? (
            gradesData.reduce((sum, g) => sum + (g.score || 0), 0) /
            gradesData.length
          ).toFixed(1)
          : 0;

      setAverageGrade(avg);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", route: "/dashboard" },
    { icon: "📚", label: "Courses", route: "/courses" },
    { icon: "📋", label: "Assignments", route: "/assignments" },
    { icon: "📈", label: "Grades", route: "/grades" },
    { icon: "🤖", label: "AI Predictions", route: "/ai-predictions" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>SGT</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item, i) => (
            <a key={i} href={item.route} className="menu-item">
              <span>{item.icon}</span>
              {sidebarOpen && item.label}
            </a>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {loading ? (
          <div className="spinner-border mt-5" />
        ) : (
          <>
            {/* Header */}
            <header className="dashboard-header">
              <input type="text" placeholder="🔍 Search..." />
              <div>
                <strong>{user?.username}</strong>
              </div>
            </header>

            {/* Welcome */}
            <div className="welcome-banner">
              <h2>Welcome back, {user?.username} 👋</h2>
              <p>{new Date().toDateString()}</p>
            </div>

            {/* 📊 ACADEMIC STATS */}
            <section className="stats-grid">
              <div className="stat-card">
                <h4>Enrolled Courses</h4>
                <p>{courses.length}</p>
              </div>

              <div className="stat-card">
                <h4>Total Grades</h4>
                <p>{grades.length}</p>
              </div>

              <div className="stat-card">
                <h4>Average Score</h4>
                <p>{averageGrade}%</p>
              </div>
            </section>

            {/* Courses */}
            <section className="courses-section">
              <h3>Your Courses</h3>
              <div className="courses-grid">
                {courses.slice(0, 2).map((course) => (
                  <div key={course.id} className="course-card">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                    <button>View</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}
