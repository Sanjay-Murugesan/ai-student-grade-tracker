import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StudentChart({ grades = [], attendance = [], type = "performance" }) {
  const gradeData = grades.map((grade, index) => ({
    name: grade.courseName || grade.subject || `A${grade.assignmentId || index + 1}`,
    score: Number(grade.marks ?? grade.score ?? 0),
    gpa: Number(grade.gradePoints ?? 0),
    semester: grade.semester || index + 1,
  }));

  if (type === "gpa") {
    const bySemester = new Map();
    gradeData.forEach((item) => {
      const values = bySemester.get(item.semester) || [];
      values.push(item.gpa);
      bySemester.set(item.semester, values);
    });
    const data = Array.from(bySemester.entries()).map(([semester, values]) => ({
      semester: `Sem ${semester}`,
      gpa: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
    }));

    return (
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.length ? data : [{ semester: "Sem 1", gpa: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="gpa" stroke="#1f6f66" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "attendance") {
    const average = attendance.length
      ? Math.round(attendance.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / attendance.length)
      : 0;
    const data = [
      { name: "Present", value: average },
      { name: "Absent", value: Math.max(0, 100 - average) },
    ];

    return (
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              <Cell fill="#1f6f66" />
              <Cell fill="#f1b24a" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={gradeData.length ? gradeData : [{ name: "No data", score: 0 }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#153b52" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
