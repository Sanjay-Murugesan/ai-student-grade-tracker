import React from "react";
import {
  Area,
  AreaChart,
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

const tooltipStyle = {
  background: "rgba(15,23,42,0.96)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "#fff",
  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
};

export default function StudentChart({
  grades = [],
  attendance = [],
  type = "performance",
}) {

  const gradeData = grades.map((grade, index) => ({
    name:
      grade.courseName ||
      grade.subject ||
      `A${grade.assignmentId || index + 1}`,

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

    const data = Array.from(bySemester.entries()).map(
      ([semester, values]) => ({
        semester: `Sem ${semester}`,

        gpa: Number(
          (
            values.reduce((sum, value) => sum + value, 0) /
            values.length
          ).toFixed(2)
        ),
      })
    );

    return (
      <div style={{ height: 340 }}>

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={
              data.length
                ? data
                : [{ semester: "Sem 1", gpa: 0 }]
            }
          >

            <defs>

              <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />

            <XAxis
              dataKey="semester"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Area
              type="monotone"
              dataKey="gpa"
              stroke="#14b8a6"
              strokeWidth={4}
              fill="url(#gpaFill)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>
    );
  }



  if (type === "attendance") {

    const average = attendance.length
      ? Math.round(
          attendance.reduce(
            (sum, item) =>
              sum + Number(item.percentage || 0),
            0
          ) / attendance.length
        )
      : 0;

    const data = [
      { name: "Present", value: average },
      { name: "Absent", value: Math.max(0, 100 - average) },
    ];

    return (
      <div style={{ height: 340 }}>

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={4}
            >

              <Cell fill="#14b8a6" />
              <Cell fill="#334155" />

            </Pie>

            <Tooltip contentStyle={tooltipStyle} />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>
    );
  }



  return (
    <div style={{ height: 340 }}>

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={
            gradeData.length
              ? gradeData
              : [{ name: "No data", score: 0 }]
          }
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip contentStyle={tooltipStyle} />

          <Bar
            dataKey="score"
            fill="#14b8a6"
            radius={[12, 12, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}