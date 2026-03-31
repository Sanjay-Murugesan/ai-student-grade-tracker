import React, { useEffect, useMemo, useState } from "react";
import { getMyAssignments } from "../../services/api";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getMyAssignments().then((response) => setAssignments(response.data));
  }, []);

  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") {
      return assignments;
    }
    return assignments.filter((assignment) => assignment.status === filter);
  }, [assignments, filter]);

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Assignment Board</p>
            <h2>Track deadlines and grading status</h2>
          </div>
          <div className="filter-row">
            {["ALL", "PENDING", "GRADED", "LATE"].map((status) => (
              <button
                key={status}
                type="button"
                className={`filter-chip ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.assignmentId}>
                <td>{assignment.title}</td>
                <td>{assignment.course}</td>
                <td>{new Date(assignment.dueDate).toLocaleString()}</td>
                <td><span className={badgeClass(assignment.status)}>{assignment.status}</span></td>
                <td>{assignment.marks != null ? `${assignment.marks}/${assignment.maxMarks || "-"}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function badgeClass(value) {
  const tone = value === "GRADED" ? "green" : value === "SUBMITTED" ? "blue" : value === "LATE" ? "red" : "gray";
  return `status-badge ${tone}`;
}
