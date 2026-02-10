import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  getStudents,
  getAssignments,
  addGrade,
  getGradesByStudent,
  getStudentByUserId
} from "../services/api";
import StudentChart from "../components/StudentChart";
import "../styles/grades.css";
import { AuthContext } from "../context/AuthContext";

/**
 * GradesPage (robust)
 * - Trims user input
 * - Removes stray dots from IDs
 * - Shows messages & loading states
 * - Logs the exact request URL sent
 */
export default function GradesPage() {
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === "INSTRUCTOR";
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
    // Load assignments for both roles
    getAssignments()
      .then(r => setAssignments(r.data))
      .catch(err => {
        console.error("Failed to load assignments", err);
        setMessage("Failed to load assignments from server.");
      });

    if (isTeacher) {
      getStudents()
        .then(r => setStudents(r.data))
        .catch(err => {
          console.error("Failed to load students", err);
          setMessage("Failed to load students from server.");
        });
    } else if (user?.id) {
      getStudentByUserId(user.id)
        .then(r => {
          const student = r.data;
          if (student?.studentId) {
            setForm((prev) => ({ ...prev, studentId: String(student.studentId) }));
            fetchGrades(student.studentId);
          } else {
            setMessage("Student profile not found for this account.");
          }
        })
        .catch(err => {
          console.error("Failed to load student profile", err);
          setMessage("Failed to load student profile.");
        });
    }
  }, [isTeacher, user]);

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

    if (!isTeacher) {
      setMessage("Only teachers can add or edit grades.");
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

  const assignmentMap = useMemo(() => {
    const map = new Map();
    assignments.forEach(a => {
      map.set(String(a.assignmentId), a);
    });
    return map;
  }, [assignments]);

  const stats = useMemo(() => {
    const total = grades.length;
    const sum = grades.reduce((acc, g) => acc + Number(g.score || 0), 0);
    const avg = total > 0 ? Math.round(sum / total) : 0;
    const max = grades.reduce((acc, g) => Math.max(acc, Number(g.score || 0)), 0);
    return { total, avg, max };
  }, [grades]);

  const gridClass = isTeacher ? "grades-grid" : "grades-grid single";

  return (
    <div className="grades-container">
      <div className="grades-header">
        <div>
          <h2 className="grades-title">Grades & Marks</h2>
          <p className="grades-subtitle">Record scores and track student performance at a glance.</p>
        </div>
        <div className="grades-actions">
          <button
            type="button"
            className="grades-btn ghost"
            onClick={() => fetchGrades(form.studentId)}
            disabled={!form.studentId || loading}
          >
            {loading ? "Loading..." : "View Grades"}
          </button>
        </div>
      </div>

      {message && <div className="grades-alert">{message}</div>}

      <div className={gridClass}>
        {isTeacher && (
          <div className="grades-card">
            <h5 className="grades-card-title">Add Grade</h5>
            <form onSubmit={handleAddGrade} className="grades-form">
              <label className="grades-label">
                Student
                <select
                  className="grades-input"
                  required
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.studentId} value={String(s.studentId)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grades-label">
                Assignment
                <select
                  className="grades-input"
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
              </label>

              <label className="grades-label">
                Score
                <input
                  type="number"
                  required
                  min="0"
                  className="grades-input"
                  placeholder="Score"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                />
              </label>

              <button className="grades-btn primary" disabled={loading}>
                {loading ? "Saving..." : "Add Grade"}
              </button>
            </form>
          </div>
        )}

        <div className="grades-card stats">
          <h5 className="grades-card-title">Overview</h5>
          <div className="grades-stats">
            <div className="grades-stat">
              <span className="grades-stat-label">Total</span>
              <span className="grades-stat-value">{stats.total}</span>
            </div>
            <div className="grades-stat">
              <span className="grades-stat-label">Average</span>
              <span className="grades-stat-value">{stats.avg}</span>
            </div>
            <div className="grades-stat">
              <span className="grades-stat-label">Highest</span>
              <span className="grades-stat-value">{stats.max}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grades-list-card">
        <div className="grades-list-header">
          <h5 className="grades-card-title">Student Grades</h5>
          <span className="grades-count">{grades.length} entries</span>
        </div>

        {grades.length === 0 ? (
          <div className="grades-empty">No grades yet. Select a student to view or add scores.</div>
        ) : (
          <div className="grades-list">
            {grades.map(g => {
              const assignment = assignmentMap.get(String(g.assignmentId));
              const maxMarks = assignment?.maxMarks ?? null;
              const progress = maxMarks ? Math.min(100, Math.round((g.score / maxMarks) * 100)) : null;

              return (
                <div key={g.gradeId} className="grades-item">
                  <div className="grades-item-main">
                    <div className="grades-item-title">
                      {assignment?.title || `Assignment #${g.assignmentId}`}
                    </div>
                    <div className="grades-item-meta">
                      ID: {g.assignmentId}
                    </div>
                  </div>

                  <div className="grades-item-score">
                    <div className="grades-score-pill">
                      {g.score}{maxMarks ? ` / ${maxMarks}` : ""}
                    </div>
                    {progress !== null && (
                      <div className="grades-progress">
                        <div className="grades-progress-bar" style={{ width: `${progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {grades.length > 0 && (
        <div className="grades-chart-card">
          <h5 className="grades-card-title">Performance Chart</h5>
          <StudentChart grades={grades} />
        </div>
      )}
    </div>
  );
}
