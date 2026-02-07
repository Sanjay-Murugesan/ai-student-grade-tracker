import React, { useEffect, useState } from "react";
import {
  getStudents,
  getAssignments,
  addGrade,
  getGradesByStudent
} from "../services/api";
import StudentChart from "../components/StudentChart";

/**
 * GradesPage (robust)
 * - Trims user input
 * - Removes stray dots from IDs
 * - Shows messages & loading states
 * - Logs the exact request URL sent
 */
export default function GradesPage() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    studentId: "",
    assignmentId: "",
    score: ""
  });

  useEffect(() => {
    // Load students and assignments once
    getStudents()
      .then(r => setStudents(r.data))
      .catch(err => {
        console.error("Failed to load students", err);
        setMessage("Failed to load students from server.");
      });

    getAssignments()
      .then(r => setAssignments(r.data))
      .catch(err => {
        console.error("Failed to load assignments", err);
        setMessage("Failed to load assignments from server.");
      });
  }, []);

  // Utility: clean ID strings (remove spaces, trailing dots, etc.)
  function cleanId(raw) {
    if (raw === null || raw === undefined) return "";
    return raw.toString().trim().replace(/\.+$/g, "").replace(/[^\d]/g, "");
  }

  const handleAddGrade = async (e) => {
    e.preventDefault();
    setMessage(null);

    const studentIdClean = cleanId(form.studentId);
    const assignmentIdClean = cleanId(form.assignmentId);

    if (!studentIdClean || !assignmentIdClean || form.score === "") {
      setMessage("Please select a student, an assignment and enter a score.");
      return;
    }

    setLoading(true);
    try {
      await addGrade({
        studentId: Number(studentIdClean),
        assignmentId: Number(assignmentIdClean),
        score: Number(form.score)
      });
      setMessage("Grade added successfully.");
      setForm({ studentId: "", assignmentId: "", score: "" });
      // Refresh grades for this student
      await fetchGrades(studentIdClean);
    } catch (err) {
      console.error("Error adding grade:", err);
      setMessage("Failed to add grade. Check server logs and connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async (rawStudentId) => {
    setMessage(null);
    const studentIdClean = cleanId(rawStudentId);
    if (!studentIdClean) {
      setMessage("Please select a valid student to view grades.");
      return;
    }

    setLoading(true);
    try {
      // log exact URL for debugging
      console.log(`Requesting grades for student -> /grades/student/${studentIdClean}`);
      const res = await getGradesByStudent(studentIdClean);
      setGrades(res.data || []);
      if (!res.data || res.data.length === 0) {
        setMessage("No grades found for this student.");
      } else {
        setMessage(null);
      }
    } catch (err) {
      console.error("Failed to fetch grades:", err);
      setMessage("Failed to fetch grades. Check server & CORS.");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Grades</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3 shadow-sm mb-4">
        <h5>Add Grade</h5>
        <form onSubmit={handleAddGrade} className="row g-3">
          <div className="col-md-3">
            <select
              className="form-control"
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                // ensure value is plain number string (no extra chars)
                <option key={s.studentId} value={String(s.studentId)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-control"
              required
              value={form.assignmentId}
              onChange={(e) => setForm({ ...form, assignmentId: e.target.value })}
            >
              <option value="">Select Assignment</option>
              {assignments.map(a => (
                <option key={a.assignmentId} value={String(a.assignmentId)}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              required
              className="form-control"
              placeholder="Score"
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Add"}
            </button>
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => fetchGrades(form.studentId)}
              disabled={!form.studentId || loading}
            >
              {loading ? "Loading..." : "View Grades"}
            </button>
          </div>
        </form>
      </div>

      <h5>Student Grades</h5>
      <ul className="list-group mb-4 shadow-sm">
        {grades.map(g => (
          <li key={g.gradeId} className="list-group-item">
            <div><strong>Assignment ID:</strong> {g.assignmentId}</div>
            <div><strong>Score:</strong> {g.score}</div>
          </li>
        ))}
      </ul>

      {grades.length > 0 && (
        <>
          <h5 className="fw-bold">Performance Chart</h5>
          <div className="card p-3 shadow-sm">
            <StudentChart grades={grades} />
          </div>
        </>
      )}
    </div>
  );
}
