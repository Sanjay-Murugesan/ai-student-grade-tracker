import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentRoster } from "../../services/api";

export default function StudentRoster() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getStudentRoster()
      .then((response) => setStudents(response.data))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    let nextRows = [...students];
    if (filter === "AT_RISK") {
      nextRows = nextRows.filter((student) => ["MEDIUM", "HIGH"].includes(student.riskLevel));
    }
    if (filter === "LOW_RISK") {
      nextRows = nextRows.filter((student) => student.riskLevel === "LOW");
    }
    nextRows.sort((left, right) => {
      const leftValue = left[sort.key];
      const rightValue = right[sort.key];
      if (leftValue < rightValue) return sort.direction === "asc" ? -1 : 1;
      if (leftValue > rightValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return nextRows;
  }, [students, sort, filter]);

  if (loading) {
    return (
      <div className="page-stack">
        <div className="panel skeleton-panel" />
        <div className="panel skeleton-panel" />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">AI Risk Roster</p>
            <h2>Sortable student overview</h2>
          </div>
          <select className="inline-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="ALL">All</option>
            <option value="AT_RISK">At Risk</option>
            <option value="LOW_RISK">Low Risk</option>
          </select>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["gpa", "GPA"],
                ["submissionRate", "Submission Rate"],
                ["riskLevel", "Risk Level"],
              ].map(([key, label]) => (
                <th key={key}>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() =>
                      setSort((current) => ({
                        key,
                        direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
                      }))
                    }
                  >
                    {label}
                  </button>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((student) => (
              <tr key={student.studentId}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.gpa}</td>
                <td>{student.submissionRate}%</td>
                <td><span className={badgeClass(student.riskLevel)}>{student.riskLevel}</span></td>
                <td>
                  <button className="secondary-button" type="button" onClick={() => navigate(`/teacher/student/${student.studentId}`)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function badgeClass(value) {
  const tone = value === "LOW" ? "green" : value === "MEDIUM" ? "amber" : "red";
  return `status-badge ${tone}`;
}
