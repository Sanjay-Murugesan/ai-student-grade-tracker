import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAssignments, getGradesByStudent, getStudentByUserId } from "../services/api";
import "../styles/dashboard.css";
import CountUp from "react-countup";

export default function StudentDashboardPage() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [averageGrade, setAverageGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadStudentData(user.id);
    }
  }, [user]);

  const loadStudentData = async (userId) => {
    try {
      setLoading(true);
      const studentRes = await getStudentByUserId(userId);
      const student = studentRes?.data;
      if (student?.studentId) {
        setStudentId(student.studentId);
        await Promise.all([fetchAssignments(), fetchGrades(student.studentId)]);
      } else {
        setAssignments([]);
        setGrades([]);
      }
    } catch (error) {
      console.error("Student dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    const assignmentsRes = await getAssignments();
    setAssignments(assignmentsRes?.data || []);
  };

  const fetchGrades = async (studentIdValue) => {
    const gradesRes = await getGradesByStudent(studentIdValue);
    const gradesData = Array.isArray(gradesRes?.data) ? gradesRes.data : [];
    setGrades(gradesData);

    const avg =
      gradesData.length > 0
        ? (
            gradesData.reduce((sum, g) => sum + (Number(g.score) || 0), 0) /
            gradesData.length
          ).toFixed(1)
        : 0;
    setAverageGrade(avg);
  };

  const upcomingAssignments = assignments.filter((a) => new Date(a.dueDate) > new Date()).length;

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
              <p className="welcome-kicker">Student Overview</p>
              <h2>Welcome back, {user?.username}</h2>
              <p className="welcome-date">{new Date().toDateString()}</p>
            </div>
            <div className="badge-chip">{studentId ? `Student ID: ${studentId}` : "Profile pending"}</div>
          </div>

          <section className="stats-grid">
            <div className="stat-card">
              <h4>Total Assignments</h4>
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

            <div className="stat-card">
              <h4>Average</h4>
              <p className="value">
                <CountUp end={Number(averageGrade)} decimals={1} />%
              </p>
            </div>
          </section>

          <section className="ai-insight">
            <h3>Performance Insight</h3>
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
