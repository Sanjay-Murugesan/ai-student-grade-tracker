import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCourses, getGradesByStudent, getStudentByUserId } from "../services/api";
import "../styles/dashboard.css";
import CountUp from "react-countup";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [averageGrade, setAverageGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const coursesRes = await getCourses();
      setCourses(coursesRes?.data || []);

      // Grades API expects a studentId, not a userId.
      const studentRes = await getStudentByUserId(user.id);
      const studentId = studentRes?.data?.studentId;

      if (!studentId) {
        setGrades([]);
        setAverageGrade(0);
        setError("Student profile not found for this user.");
        return;
      }

      const gradesRes = await getGradesByStudent(studentId);
      const gradesData = Array.isArray(gradesRes?.data) ? gradesRes.data : [];

      setGrades(gradesData);

      const totalScore = gradesData.reduce((sum, grade) => sum + (Number(grade.score) || 0), 0);
      const avg = gradesData.length > 0 ? Number((totalScore / gradesData.length).toFixed(1)) : 0;

      setAverageGrade(avg);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {loading ? (
        <div className="skeleton-dashboard">
          <div className="skeleton banner"></div>
          <div className="skeleton card"></div>
          <div className="skeleton card"></div>
          <div className="skeleton card"></div>
        </div>
      ) : (
        <>
          {error && <div className="grades-alert mb-3">{error}</div>}

          <div className="welcome-banner">
            <div className="welcome-copy">
              <p className="welcome-kicker">Student Overview</p>
              <h2>Welcome back, {user?.username}</h2>
              <p className="welcome-date">{new Date().toDateString()}</p>
            </div>
            <button className="ghost-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>

          <section className="stats-grid">
            <div className="stat-card">
              <h4>Courses</h4>
              <p className="value">
                <CountUp end={courses.length} />
              </p>
            </div>

            <div className="stat-card">
              <h4>Grades</h4>
              <p className="value">
                <CountUp end={grades.length} />
              </p>
            </div>

            <div className="stat-card">
              <h4>Average</h4>
              <p className="value">
                <CountUp end={Number(averageGrade)} decimals={1} />%
              </p>
            </div>
          </section>

          <section className="ai-insight">
            <h3>AI Insight</h3>
            <p>
              {averageGrade >= 75
                ? "Excellent performance. Keep it up!"
                : averageGrade >= 50
                ? "Good progress. Focus more on assignments."
                : "Needs improvement. Stay consistent."}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
