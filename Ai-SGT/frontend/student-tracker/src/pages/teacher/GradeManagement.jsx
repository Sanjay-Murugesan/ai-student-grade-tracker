import React, { useEffect, useMemo, useState } from "react";
import { bulkSaveGrades, getAllSubmissions, getAssignments, getUngradedSubmissions } from "../../services/api";

export default function GradeManagement() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [ungraded, setUngraded] = useState({ count: 0, submissions: [] });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    Promise.all([getAssignments(), getAllSubmissions(), getUngradedSubmissions()]).then(([assignmentRes, submissionRes, ungradedRes]) => {
      setAssignments(assignmentRes.data);
      setSubmissions(submissionRes.data);
      setUngraded(ungradedRes.data);
      setSelectedAssignment(assignmentRes.data[0] || null);
    });
  }, []);

  const assignmentRows = useMemo(
    () => submissions.filter((submission) => submission.assignmentId === selectedAssignment?.assignmentId),
    [selectedAssignment, submissions]
  );

  const handleSave = async () => {
    const payload = assignmentRows
      .map((submission) => ({
        studentId: submission.studentId,
        assignmentId: submission.assignmentId,
        courseId: selectedAssignment?.courseId,
        score: Number(drafts[submission.submissionId] ?? 0),
        maxScore: selectedAssignment?.maxMarks || 100,
        gradeType: "ASSIGNMENT",
      }))
      .filter((item) => !Number.isNaN(item.score));

    await bulkSaveGrades(payload);
  };

  return (
    <div className="page-stack">
      <section className="content-grid two-column">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Assignments</p>
              <h2>Choose an assessment</h2>
            </div>
          </div>
          <div className="list-stack">
            {assignments.map((assignment) => {
              const count = ungraded.submissions?.filter((item) => item.assignmentId === assignment.assignmentId).length || 0;
              return (
                <button
                  key={assignment.assignmentId}
                  type="button"
                  className={`list-item ${selectedAssignment?.assignmentId === assignment.assignmentId ? "active" : ""}`}
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <span>{assignment.title}</span>
                  <span className="status-badge amber">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Grade Entry</p>
              <h2>{selectedAssignment?.title || "Select an assignment"}</h2>
            </div>
            <button className="primary-button" type="button" onClick={handleSave}>
              Bulk Save
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Current Score</th>
                <th>New Score</th>
              </tr>
            </thead>
            <tbody>
              {assignmentRows.map((submission) => (
                <tr key={submission.submissionId}>
                  <td>{submission.studentId}</td>
                  <td>{submission.status === "GRADED" ? "Graded" : "Pending"}</td>
                  <td>
                    <input
                      className="table-input"
                      type="number"
                      value={drafts[submission.submissionId] ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [submission.submissionId]: event.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
