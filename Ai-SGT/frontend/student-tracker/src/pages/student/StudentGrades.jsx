import React, { useEffect, useMemo, useState } from "react";
import { getMyGrades } from "../../services/api";

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    getMyGrades().then((response) => setGrades(response.data));
  }, []);

  const grouped = useMemo(() => {
    return grades.reduce((accumulator, grade) => {
      const key = grade.courseId ? `Course ${grade.courseId}` : "General";
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(grade);
      return accumulator;
    }, {});
  }, [grades]);

  return (
    <div className="page-stack">
      {Object.entries(grouped).map(([course, courseGrades]) => {
        const average =
          courseGrades.reduce((sum, grade) => sum + ((grade.score || 0) / (grade.maxScore || 100)) * 100, 0) /
          courseGrades.length;

        return (
          <section className="panel" key={course}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Course Performance</p>
                <h2>{course}</h2>
              </div>
              <span className={percentageTone(average)}>{average.toFixed(1)}%</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment Name</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Max</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {courseGrades.map((grade) => {
                  const percentage = ((grade.score || 0) / (grade.maxScore || 100)) * 100;
                  return (
                    <tr key={grade.gradeId}>
                      <td>{grade.assignmentId ? `Assignment ${grade.assignmentId}` : "Assessment"}</td>
                      <td>{grade.gradeType || "GRADE"}</td>
                      <td>{grade.score ?? "-"}</td>
                      <td>{grade.maxScore ?? 100}</td>
                      <td><span className={percentageTone(percentage)}>{percentage.toFixed(1)}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}

function percentageTone(value) {
  if (value >= 75) return "status-badge green";
  if (value >= 50) return "status-badge amber";
  return "status-badge red";
}
