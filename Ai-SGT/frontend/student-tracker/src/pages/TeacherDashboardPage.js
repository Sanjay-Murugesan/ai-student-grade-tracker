import React, { useEffect, useState } from "react";
import { getAssignments, getGrades, getStudents } from "../services/api";
import "../styles/dashboard.css";
import CountUp from "react-countup";

export default function TeacherDashboardPage() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, assignmentsRes, gradesRes] = await Promise.all([
        getStudents(),
        getAssignments(),
        getGrades()
      ]);
      setStudents(studentsRes?.data || []);
      setAssignments(assignmentsRes?.data || []);
      setGrades(gradesRes?.data || []);
    } catch (error) {
      console.error("Teacher dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAssignments = assignments.filter((a) => new Date(a.dueDate) > new Date()).length;
  const avgScore =
    grades.length > 0
      ? (
          grades.reduce((sum, g) => sum + (Number(g.score) || 0), 0) / grades.length
        ).toFixed(1)
      : 0;

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
          <div className="welcome-banner">
            <div className="welcome-copy">
              <p className="welcome-kicker">Teacher Control Center</p>
              <h2>Manage student progress</h2>
              <p className="welcome-date">{new Date().toDateString()}</p>
            </div>
            <div className="badge-chip">Instructor Access</div>
          </div>

          <section className="stats-grid">
            <div className="stat-card">
              <h4>Total Students</h4>
              <p className="value">
                <CountUp end={students.length} />
              </p>
            </div>

            <div className="stat-card">
              <h4>Assignments</h4>
              <p className="value">
                <CountUp end={assignments.length} />
              </p>
            </div>

            <div className="stat-card">
              <h4>Upcoming</h4>
              <p className="value">
                <CountUp end={upcomingAssignments} />
              </p>
            </div>
          </section>

          <section className="ai-insight">
            <h3>Class Performance</h3>
            <p>
              Average grade across all submissions is <strong>{avgScore}%</strong>.{" "}
              Review low-performing assignments and adjust support where needed.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
