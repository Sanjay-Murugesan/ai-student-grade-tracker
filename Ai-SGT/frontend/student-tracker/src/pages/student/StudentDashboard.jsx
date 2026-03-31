import React, { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getMyAssignments, getMyGrades, getStudentDashboard } from "../../services/api";

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    Promise.all([getStudentDashboard(), getMyGrades(), getMyAssignments()]).then(([dashboardRes, gradesRes, assignmentsRes]) => {
      setDashboard(dashboardRes.data);
      setGrades(gradesRes.data);
      setAssignments(assignmentsRes.data);
    });
  }, []);

  const trendData = useMemo(
    () =>
      grades.map((grade, index) => ({
        label: `${grade.gradeType || "GRADE"} ${index + 1}`,
        score: grade.score || 0,
        course: grade.courseId ? `Course ${grade.courseId}` : "Course",
      })),
    [grades]
  );

  const upcomingAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) => assignment.status === "PENDING")
        .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
        .slice(0, 5),
    [assignments]
  );

  if (!dashboard) {
    return <div className="panel">Loading dashboard...</div>;
  }

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <StatCard label="GPA" value={dashboard.gpa ?? 0} />
        <StatCard label="Attendance %" value={dashboard.attendancePercent ?? 0} />
        <StatCard label="Pending Assignments" value={dashboard.pendingAssignments ?? 0} />
        <StatCard label="Risk Level" value={dashboard.riskLevel} badge />
      </section>

      <section className="content-grid two-column">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Performance Trend</p>
              <h2>Grade trajectory</h2>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" stroke="#aeb4d5" />
                <YAxis stroke="#aeb4d5" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#71f6ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Upcoming Work</p>
              <h2>Next 5 pending assignments</h2>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAssignments.map((assignment) => (
                <tr key={assignment.assignmentId}>
                  <td>{assignment.title}</td>
                  <td>{assignment.course}</td>
                  <td>{new Date(assignment.dueDate).toLocaleString()}</td>
                  <td><span className={badgeClass(assignment.status)}>{assignment.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, badge = false }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      {badge ? <span className={badgeClass(value)}>{value}</span> : <strong>{value}</strong>}
    </div>
  );
}

function badgeClass(value) {
  const tone = value === "LOW" || value === "GRADED" ? "green" : value === "MEDIUM" || value === "SUBMITTED" ? "amber" : value === "HIGH" || value === "LATE" ? "red" : "gray";
  return `status-badge ${tone}`;
}
