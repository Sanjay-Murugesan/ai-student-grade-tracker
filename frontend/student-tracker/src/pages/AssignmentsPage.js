import React, { useEffect, useState } from "react";
import { getAssignments, addAssignment } from "../services/api";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxMarks: ""
  });

  // Load assignments on page load
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    getAssignments()
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Failed to fetch assignments", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addAssignment({
      ...form,
      maxMarks: Number(form.maxMarks)
    })
      .then(() => {
        setForm({ title: "", description: "", dueDate: "", maxMarks: "" });
        fetchAssignments();
      })
      .catch(err => console.error("Failed to add assignment", err));
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Assignments</h2>

      {/* Add Assignment Form */}
      <div className="card p-3 shadow-sm mb-4">
        <h5>Add Assignment</h5>
        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-md-4">
            <input
              required
              className="form-control"
              placeholder="Assignment Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className="col-md-1">
            <input
              type="number"
              className="form-control"
              placeholder="Marks"
              value={form.maxMarks}
              onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
            />
          </div>

          <div className="col-md-1">
            <button className="btn btn-success w-100">Add</button>
          </div>

        </form>
      </div>

      {/* Assignment List */}
      <div className="list-group shadow-sm">
        {assignments.map(a => (
          <div key={a.assignmentId} className="list-group-item">
            <h6 className="mb-1">{a.title}</h6>
            <div className="text-muted small">Max Marks: {a.maxMarks}</div>
            <div className="small">{a.description}</div>
            <div className="small text-muted">Due: {a.dueDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
