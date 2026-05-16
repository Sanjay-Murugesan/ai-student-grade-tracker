import React, { useEffect, useState } from "react";

import {
  getAllSubmissions,
  updateSubmissionGrade,
} from "../services/api";

export default function SubmissionsPage() {

  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {

    try {

      const res = await getAllSubmissions();

      setSubmissions(res.data || []);

    } catch (err) {

      console.error("Failed to load submissions", err);

    } finally {

      setLoading(false);

    }
  };

  const handleGrade = async (submission) => {

    const marks = prompt("Enter marks");

    const feedback = prompt("Enter feedback");

    if (marks === null) return;

    try {

      await updateSubmissionGrade(
        submission.submissionId,
        {
          ...submission,
          marks: Number(marks),
          feedback,
          status: "GRADED",
        }
      );

      alert("Submission graded!");

      fetchSubmissions();

    } catch (err) {

      console.error("Failed to update grade", err);

    }
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2>Submissions Management</h2>

          <p className="text-muted">
            Review and grade student submissions
          </p>

        </div>

      </div>

      <div className="card shadow-sm border-0">

        <div className="card-body">

          <table className="table table-hover align-middle">

            <thead>

              <tr>

                <th>ID</th>

                <th>Student</th>

                <th>Assignment</th>

                <th>Status</th>

                <th>Marks</th>

                <th>Feedback</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {submissions.map((submission) => (

                <tr key={submission.submissionId}>

                  <td>{submission.submissionId}</td>

                  <td>{submission.studentId}</td>

                  <td>{submission.assignmentId}</td>

                  <td>{submission.status}</td>

                  <td>{submission.marks || "-"}</td>

                  <td>{submission.feedback || "-"}</td>

                  <td>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleGrade(submission)
                      }
                    >
                      Grade
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}