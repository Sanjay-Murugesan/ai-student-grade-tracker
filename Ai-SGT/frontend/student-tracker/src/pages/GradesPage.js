import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getStudents, getAssignments, addGrade, updateGrade,
  getGradesByStudent, getStudentByUserId,
} from "../services/api";
import StudentChart from "../components/StudentChart";
import "../styles/grades.css";

function scoreClass(score, max) {
  if (!max) return "";
  const pct = (score / max) * 100;
  if (pct < 40) return "low";
  if (pct < 70) return "medium";
  return "";
}

function gradeLetter(score, max) {
  if (!max) return "—";
  const pct = (score / max) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export default function GradesPage() {
  const { user }    = useContext(AuthContext);
  const isTeacher   = user?.role === "INSTRUCTOR";

  const [students,     setStudents]     = useState([]);
  const [assignments,  setAssignments]  = useState([]);
  const [grades,       setGrades]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [alertMsg,     setAlertMsg]     = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [form, setForm] = useState({
    studentId: "", assignmentId: "", score: "",
  });

  /* ── flash ── */
  const flash = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  /* ── fetch grades ── */
  const fetchGrades = useCallback(async (sid) => {
    if (!sid) return;
    setLoading(true);
    try {
      const res  = await getGradesByStudent(sid);
      const data = Array.isArray(res.data) ? res.data : [];
      setGrades(data);
      if (data.length === 0) flash("info", "No grades recorded for this student yet.");
    } catch {
      flash("error", "Failed to fetch grades.");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── bootstrap ── */
  useEffect(() => {
    getAssignments()
      .then(r => setAssignments(Array.isArray(r.data) ? r.data : []))
      .catch(() => flash("error", "Failed to load assignments."));

    if (isTeacher) {
      getStudents()
        .then(r => setStudents(Array.isArray(r.data) ? r.data : []))
        .catch(() => flash("error", "Failed to load students."));
    } else if (user?.id) {
      /* Student: auto-load their own grades */
      getStudentByUserId(user.id)
        .then(r => {
          const s = r.data;
          if (s?.studentId) {
            setSelectedStudentId(String(s.studentId));
            setForm(p => ({ ...p, studentId: String(s.studentId) }));
            fetchGrades(s.studentId);
          } else {
            flash("error", "Student profile not found.");
          }
        })
        .catch(() => flash("error", "Failed to load student profile."));
    }
  }, [fetchGrades, isTeacher, user]);

  /* ── Instructor: student selector changes ── */
  const handleStudentChange = (sid) => {
    setSelectedStudentId(sid);
    setForm(p => ({ ...p, studentId: sid, assignmentId: "", score: "" }));
    setGrades([]);
    if (sid) fetchGrades(sid);
  };

  /* ── Add grade (instructor only) — duplicate guard ── */
  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!isTeacher) { flash("error", "Only instructors can add grades."); return; }

    const sid = form.studentId;
    const aid = form.assignmentId;
    if (!sid || !aid || form.score === "") {
      flash("error", "Select a student, an assignment, and enter a score.");
      return;
    }

    /* Duplicate check */
    const duplicate = grades.some(
      g => String(g.assignmentId) === String(aid)
    );
    if (duplicate) {
      flash("error", "Grade for this assignment already exists. Use the Edit button to update it.");
      return;
    }

    const assignment = assignments.find(a => String(a.assignmentId) === String(aid));
    const max        = assignment?.maxMarks;
    if (max && Number(form.score) > Number(max)) {
      flash("error", `Score cannot exceed max marks (${max}).`);
      return;
    }

    setLoading(true);
    try {
      await addGrade({
        studentId:    Number(sid),
        assignmentId: Number(aid),
        score:        Number(form.score),
      });
      flash("success", "Grade added successfully.");
      setForm(p => ({ ...p, assignmentId: "", score: "" }));
      await fetchGrades(sid);
    } catch (err) {
      flash("error", err.response?.data?.message || "Failed to add grade.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Inline edit save ── */
  const handleEditSave = async (gradeId) => {
    if (editingGrade?.score === "" || editingGrade?.score === undefined) return;
    setLoading(true);
    try {
      await updateGrade(gradeId, { score: Number(editingGrade.score) });
      flash("success", "Grade updated.");
      setEditingGrade(null);
      await fetchGrades(selectedStudentId || form.studentId);
    } catch {
      flash("error", "Failed to update grade.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = grades.length;
    const sum   = grades.reduce((s, g) => s + Number(g.score || 0), 0);
    return {
      total,
      avg: total > 0 ? Math.round(sum / total) : 0,
      max: total > 0 ? Math.max(...grades.map(g => Number(g.score || 0))) : 0,
    };
  }, [grades]);

  const assignmentMap = useMemo(() => {
    const m = new Map();
    assignments.forEach(a => m.set(String(a.assignmentId), a));
    return m;
  }, [assignments]);

  /* Assignments not yet graded (for instructor dropdown) */
  const ungradedAssignments = useMemo(() => {
    const gradedIds = new Set(grades.map(g => String(g.assignmentId)));
    return assignments.filter(a => !gradedIds.has(String(a.assignmentId)));
  }, [assignments, grades]);

  return (
    <div className="grades-page">

      {/* ── Header ── */}
      <div className="grades-header">
        <div className="grades-header-left">
          <h1>Grades & Marks</h1>
          <p>
            {isTeacher
              ? "Select a student to view or enter grades for their assignments."
              : "View your grades and performance across all assignments."}
          </p>
        </div>
      </div>

      {/* ── Alert ── */}
      {alertMsg && (
        <div className={`grades-alert ${alertMsg.type}`}>
          {alertMsg.type === "error"   && "⚠️ "}
          {alertMsg.type === "success" && "✅ "}
          {alertMsg.type === "info"    && "ℹ️ "}
          {alertMsg.text}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grades-stats-row">
        {[
          { icon: "📊", label: "Total Grades",  value: stats.total, cls: "teal"   },
          { icon: "📈", label: "Average Score", value: stats.avg,   cls: "blue"   },
          { icon: "🏆", label: "Highest Score", value: stats.max,   cls: "purple" },
        ].map(s => (
          <div key={s.label} className="grades-stat-card">
            <div className={`grades-stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="grades-stat-value">{s.value}</div>
              <div className="grades-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Layout ── */}
      <div className={`grades-layout ${!isTeacher ? "student-view" : ""}`}>

        {/* ── Left: Instructor form ── */}
        {isTeacher && (
          <div className="grades-card">
            <div className="grades-card-title">📝 Enter Grade</div>

            {/* Step 1: pick student */}
            <div className="sgt-form-group" style={{ marginBottom: 14 }}>
              <label className="sgt-label">1. Select Student</label>
              <select
                className="sgt-input"
                value={selectedStudentId}
                onChange={e => handleStudentChange(e.target.value)}
              >
                <option value="">— Choose a student —</option>
                {students.map(s => (
                  <option key={s.studentId} value={String(s.studentId)}>
                    {s.name || s.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: grade form (show only after student selected) */}
            {selectedStudentId && (
              <form className="grades-form" onSubmit={handleAddGrade}>
                <div className="sgt-form-group">
                  <label className="sgt-label">2. Assignment</label>
                  <select
                    className="sgt-input"
                    required
                    value={form.assignmentId}
                    onChange={e => setForm(p => ({ ...p, assignmentId: e.target.value }))}
                  >
                    <option value="">— Select assignment —</option>
                    {ungradedAssignments.length === 0
                      ? <option disabled>All assignments graded ✓</option>
                      : ungradedAssignments.map(a => (
                          <option key={a.assignmentId} value={String(a.assignmentId)}>
                            {a.title} {a.maxMarks ? `(max: ${a.maxMarks})` : ""}
                          </option>
                        ))
                    }
                  </select>
                </div>

                <div className="sgt-form-group">
                  <label className="sgt-label">3. Score</label>
                  <input
                    type="number"
                    min="0"
                    className="sgt-input"
                    placeholder="Enter score"
                    value={form.score}
                    onChange={e => setForm(p => ({ ...p, score: e.target.value }))}
                    required
                  />
                  {form.assignmentId && (() => {
                    const a = assignmentMap.get(form.assignmentId);
                    return a?.maxMarks
                      ? <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                          Max marks: {a.maxMarks}
                        </span>
                      : null;
                  })()}
                </div>

                <button className="grades-submit-btn" disabled={loading || ungradedAssignments.length === 0}>
                  {loading ? "Saving…" : "➕ Add Grade"}
                </button>
              </form>
            )}

            {!selectedStudentId && (
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 8 }}>
                Select a student above to see their assignments and enter grades.
              </p>
            )}
          </div>
        )}

        {/* ── Right: Overview ── */}
        <div className="grades-card">
          <div className="grades-card-title">📋 Overview</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Total Grades",  value: stats.total, color: "#0d9488" },
              { label: "Average Score", value: stats.avg,   color: "#3b82f6" },
              { label: "Highest Score", value: stats.max,   color: "#8b5cf6" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #f1f5f9",
              }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: "1.15rem", fontWeight: 800,
                  color: item.color,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grades list ── */}
      <div className="grades-list-card">
        <div className="grades-list-header">
          <span className="grades-list-title">
            📝 {isTeacher
              ? selectedStudentId
                ? `Grades — ${students.find(s => String(s.studentId) === selectedStudentId)?.name || "Student"}`
                : "Student Grades"
              : "My Grades"}
          </span>
          <span className="grades-entries-count">{grades.length} entries</span>
        </div>

        {loading ? (
          <div className="grades-loading">
            <div className="grades-spinner" />
            Loading grades…
          </div>
        ) : grades.length === 0 ? (
          <div className="grades-empty">
            <div className="grades-empty-icon">📭</div>
            <p>
              {isTeacher
                ? selectedStudentId
                  ? "No grades yet for this student. Use the form to add grades."
                  : "Select a student from the form to view their grades."
                : "No grades recorded yet. Your instructor will enter your marks here."}
            </p>
          </div>
        ) : (
          <div className="grades-list">
            {grades.map(g => {
              const assignment = assignmentMap.get(String(g.assignmentId));
              const maxMarks   = assignment?.maxMarks ?? null;
              const progress   = maxMarks
                ? Math.min(100, Math.round((g.score / maxMarks) * 100))
                : null;
              const cls        = scoreClass(g.score, maxMarks);
              const letter     = gradeLetter(g.score, maxMarks);
              const isEditing  = editingGrade?.gradeId === g.gradeId;

              return (
                <div key={g.gradeId} className="grades-row">
                  {/* Grade letter circle */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                    background: cls === "low" ? "#fef2f2" : cls === "medium" ? "#fffbeb" : "rgba(13,148,136,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.85rem",
                    color: cls === "low" ? "#ef4444" : cls === "medium" ? "#f59e0b" : "#0d9488",
                  }}>
                    {letter}
                  </div>

                  <div className="grades-row-info">
                    <div className="grades-row-title">
                      {assignment?.title || `Assignment #${g.assignmentId}`}
                    </div>
                    <div className="grades-row-sub">
                      ID: {g.assignmentId}
                      {maxMarks ? ` • Max: ${maxMarks} pts` : ""}
                    </div>
                  </div>

                  <div className="grades-row-right">
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input
                          type="number" min="0"
                          style={{
                            width: 70, padding: "4px 8px",
                            border: "1.5px solid #0d9488", borderRadius: 7,
                            fontSize: "0.85rem", fontFamily: "'DM Mono', monospace",
                            outline: "none",
                          }}
                          value={editingGrade.score}
                          onChange={e => setEditingGrade(p => ({ ...p, score: e.target.value }))}
                        />
                        <button className="grades-edit-btn"
                          onClick={() => handleEditSave(g.gradeId)}
                          style={{ background: "#0d9488", color: "white", border: "none" }}>
                          Save
                        </button>
                        <button className="grades-edit-btn"
                          onClick={() => setEditingGrade(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <span className={`grades-score-pill ${cls}`}>
                          {g.score}{maxMarks ? ` / ${maxMarks}` : ""}
                        </span>
                        {progress !== null && (
                          <div className="grades-mini-progress">
                            <div className="grades-mini-progress-fill" style={{
                              width: `${progress}%`,
                              background: cls === "low" ? "#ef4444"
                                : cls === "medium" ? "#f59e0b" : "#0d9488",
                            }} />
                          </div>
                        )}
                        {/* Only instructor can edit */}
                        {isTeacher && (
                          <button className="grades-edit-btn"
                            onClick={() => setEditingGrade({ gradeId: g.gradeId, score: g.score })}>
                            ✏️ Edit
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Chart (show for both roles when grades exist) ── */}
      {grades.length > 0 && (
        <div className="grades-chart-card">
          <div className="grades-card-title">📈 Performance Chart</div>
          <StudentChart grades={grades} />
        </div>
      )}
    </div>
  );
}