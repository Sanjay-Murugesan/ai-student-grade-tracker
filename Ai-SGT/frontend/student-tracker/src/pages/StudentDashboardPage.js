import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAssignments, getGradesByStudent, getStudentByUserId } from "../services/api";
import "../styles/dashboard.css";
import CountUp from "react-countup";

export default function StudentDashboardPage() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [averageGrade, setAverageGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const fetchAssignments = useCallback(async () => {
    const assignmentsRes = await getAssignments();
    setAssignments(Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []);
  }, []);

  const fetchGrades = useCallback(async (studentIdValue) => {
    const gradesRes = await getGradesByStudent(studentIdValue);
    const gradesData = Array.isArray(gradesRes?.data) ? gradesRes.data : [];
    const average =
      gradesData.length > 0
        ? Number(
            (
              gradesData.reduce((sum, grade) => sum + (Number(grade.score) || 0), 0) /
              gradesData.length
            ).toFixed(1)
          )
        : 0;

    setAverageGrade(average);
  }, []);

  const loadStudentData = useCallback(async (userId) => {
    try {
      setLoading(true);
      const studentRes = await getStudentByUserId(userId);
      const student = studentRes?.data;

      if (student?.studentId) {
        setStudentId(student.studentId);
        await Promise.all([fetchAssignments(), fetchGrades(student.studentId)]);
      } else {
        setStudentId(null);
        setAssignments([]);
        setAverageGrade(0);
      }
    } catch (error) {
      console.error("Student dashboard fetch error:", error);
      setStudentId(null);
      setAssignments([]);
      setAverageGrade(0);
    } finally {
      setLoading(false);
    }
  }, [fetchAssignments, fetchGrades]);

  useEffect(() => {
    if (user?.id) {
      loadStudentData(user.id);
    }
  }, [loadStudentData, user]);

  const upcomingAssignments = useMemo(
    () => assignments.filter((assignment) => new Date(assignment.dueDate) > new Date()).length,
    [assignments]
  );

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
