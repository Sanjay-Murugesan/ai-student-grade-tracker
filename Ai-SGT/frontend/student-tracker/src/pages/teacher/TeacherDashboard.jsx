import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { getAllGrades, getTeacherDashboard } from "../../services/api";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    Promise.all([getTeacherDashboard(), getAllGrades()]).then(([dashboardRes, gradesRes]) => {
      setDashboard(dashboardRes.data);
      setGrades(gradesRes.data);
    });
  }, []);

  const distribution = useMemo(() => {
    const buckets = {
      "0-49": 0,
      "50-64": 0,
      "65-74": 0,
      "75-84": 0,
      "85-100": 0,
    };
    grades.forEach((grade) => {
      const percentage = ((grade.score || 0) / (grade.maxScore || 100)) * 100;
      if (percentage < 50) buckets["0-49"] += 1;
      else if (percentage < 65) buckets["50-64"] += 1;
      else if (percentage < 75) buckets["65-74"] += 1;
      else if (percentage < 85) buckets["75-84"] += 1;
      else buckets["85-100"] += 1;
    });
    return Object.entries(buckets).map(([bucket, value]) => ({ bucket, value }));
  }, [grades]);

  if (!dashboard) {
    return <div className="panel">Loading teacher dashboard...</div>;
  }

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <StatCard label="Total Students" value={dashboard.totalStudents} />
        <StatCard label="Class Average" value={dashboard.classAverage} />
        <button className="stat-card button-card" type="button" onClick={() => navigate("/teacher/roster")}>
          <p>At-Risk Students</p>
          <strong>{dashboard.atRiskCount}</strong>
        </button>
        <StatCard label="Ungraded Submissions" value={dashboard.ungradedSubmissions} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Class Snapshot</p>
            <h2>Grade distribution</h2>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={distribution}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="bucket" stroke="#aeb4d5" />
              <YAxis stroke="#aeb4d5" />
              <Tooltip />
              <Bar dataKey="value" fill="#8452ff" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
