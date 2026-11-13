import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  addGrade,
  updateGrade,
  deleteGrade,
  getStudents,
  getAssignments,
  getGradesByStudent,
  getStudentByUserId,
} from "../services/api";

import StudentChart from "../components/StudentChart";
import "../styles/grades.css";
import { AuthContext } from "../context/AuthContext";

function cleanId(raw) {
  if (raw === null || raw === undefined) return "";
  return raw.toString().trim().replace(/\.+$/g, "").replace(/[^\d]/g, "");
}

export default function GradesPage() {
  const { user } = useContext(AuthContext);

  const isTeacher = user?.role === "INSTRUCTOR";

  const [students, setStudents] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [editingGrade, setEditingGrade] = useState(null);

  const [form, setForm] = useState({
    studentId: "",
    assignmentId: "",
    internalMarks: "",
    semesterMarks: "",
    assignmentMarks: "",
    semester: "",
  });

  const fetchGrades = useCallback(async (rawStudentId) => {
    setMessage(null);

    const studentIdClean = cleanId(rawStudentId);

    if (!studentIdClean) {
      setMessage("Please select a valid student to view grades.");
      return;
    }

    setLoading(true);

    try {
      console.log(`Requesting grades for student -> /grades/student/${studentIdClean}`);

      const res = await getGradesByStudent(studentIdClean);

      const gradesData = Array.isArray(res.data) ? res.data : [];

      setGrades(gradesData);

      if (gradesData.length === 0) {
        setMessage("No grades found for this student.");
      }
    } catch (err) {
      console.error("Failed to fetch grades:", err);
      setMessage("Failed to fetch grades. Check server and CORS.");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAssignments()
      .then((res) => {
        setAssignments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load assignments", err);
        setMessage("Failed to load assignments from server.");
      });

    if (isTeacher) {
      getStudents()
        .then((res) => {
          setStudents(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Failed to load students", err);
          setMessage("Failed to load students from server.");
        });
    } else if (user?.id) {
      getStudentByUserId(user.id)
        .then((res) => {
          const student = res.data;

          if (student?.studentId) {
            setStudentProfile(student);

            setForm((prev) => ({
              ...prev,
              studentId: String(student.studentId),
            }));

            fetchGrades(student.studentId);
          } else {
            setMessage("Student profile not found for this account.");
          }
        })
        .catch((err) => {
          console.error("Failed to load student profile", err);
          setMessage("Failed to load student profile.");
        });
    }
  }, [fetchGrades, isTeacher, user]);

  const resetForm = () => {
    setEditingGrade(null);

    setForm({
      studentId: "",
      assignmentId: "",
      internalMarks: "",
      semesterMarks: "",
      assignmentMarks: "",
      semester: "",
    });
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();

    setMessage(null);

    const studentIdClean = cleanId(form.studentId);
    const assignmentIdClean = cleanId(form.assignmentId);

    if (!studentIdClean || !assignmentIdClean || form.assignmentMarks === "") {
      setMessage("Please select a student, an assignment and enter assignment marks.");
      return;
    }

    if (!isTeacher) {
      setMessage("Only teachers can add or edit grades.");
      return;
    }

    setLoading(true);

    try {
      const assignment = assignments.find(
        (item) => String(item.assignmentId) === assignmentIdClean
      );

      const assignmentMarksValue = Number(form.assignmentMarks) || 0;

      const payload = {
        studentId: Number(studentIdClean),
        assignmentId: Number(assignmentIdClean),
        courseId: assignment?.courseId || null,

        internalMarks: Number(form.internalMarks) || 0,
        semesterMarks: Number(form.semesterMarks) || 0,
        assignmentMarks: assignmentMarksValue,

        score: assignmentMarksValue,
        marks: assignmentMarksValue,

        semester: form.semester ? Number(form.semester) : null,
      };

      if (editingGrade) {
        await updateGrade(editingGrade.gradeId, {
          ...editingGrade,
          ...payload,
        });

        setMessage("Grade updated successfully.");
      } else {
        await addGrade(payload);

        setMessage("Grade added successfully.");
      }

      setEditingGrade(null);

      setForm({
        studentId: "",
        assignmentId: "",
        internalMarks: "",
        semesterMarks: "",
        assignmentMarks: "",
        semester: "",
      });

      await fetchGrades(studentIdClean);
    } catch (err) {
      console.error("Error saving grade:", err);
      setMessage("Failed to save grade. Check server logs and connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);

    setForm({
      studentId: grade.studentId ? String(grade.studentId) : "",
      assignmentId: grade.assignmentId ? String(grade.assignmentId) : "",
      internalMarks: grade.internalMarks ?? "",
      semesterMarks: grade.semesterMarks ?? "",
      assignmentMarks: grade.assignmentMarks ?? grade.marks ?? grade.score ?? "",
      semester: grade.semester ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteGrade = async (gradeId, studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this grade?");

    if (!confirmDelete) return;

    setLoading(true);
    setMessage(null);

    try {
      await deleteGrade(gradeId);

      setMessage("Grade deleted successfully.");

      await fetchGrades(studentId);
    } catch (err) {
      console.error("Error deleting grade:", err);
      setMessage("Failed to delete grade.");
    } finally {
      setLoading(false);
    }
  };

  const assignmentMap = useMemo(() => {
    const map = new Map();

    assignments.forEach((assignment) => {
      map.set(String(assignment.assignmentId), assignment);
    });

    return map;
  }, [assignments]);

  const stats = useMemo(() => {
    const total = grades.length;

    const sum = grades.reduce((acc, grade) => {
      return acc + Number(grade.score || grade.marks || grade.assignmentMarks || 0);
    }, 0);

    const avg = total > 0 ? Math.round(sum / total) : 0;

    const max = grades.reduce((acc, grade) => {
      return Math.max(acc, Number(grade.score || grade.marks || grade.assignmentMarks || 0));
    }, 0);

    return {
      total,
      avg,
      max,
    };
  }, [grades]);

  const gridClass = isTeacher ? "grades-grid" : "grades-grid single";

 return (
  <div className="grades-container fade-page">

    <div className="grades-hero">

      <div>
        <h1 className="grades-main-title">
          📊 Student Performance Dashboard
        </h1>

        <p className="grades-main-subtitle">
          Track marks, GPA, assignments and academic performance.
        </p>
      </div>

      <div className="grades-hero-badge">
        {grades.length} Records
      </div>

    </div>

    {message && (
      <div className="grades-alert">
        {message}
      </div>
    )}

    <div className={gridClass}>

      {isTeacher && (

        <div className="grades-card">

          <h5 className="grades-card-title">
            ✏️ {editingGrade ? "Edit Grade" : "Add Grade"}
          </h5>

          <form
            onSubmit={handleAddGrade}
            className="grades-form"
          >

            <label className="grades-label">
              Student

              <select
                className="grades-input"
                required
                value={form.studentId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    studentId:e.target.value,
                  })
                }
              >

                <option value="">
                  Select Student
                </option>

                {students.map((student)=>(
                  <option
                    key={student.studentId}
                    value={String(student.studentId)}
                  >
                    {student.name}
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
                onChange={(e)=>
                  setForm({
                    ...form,
                    assignmentId:e.target.value,
                  })
                }
              >

                <option value="">
                  Select Assignment
                </option>

                {assignments.map((assignment)=>(
                  <option
                    key={assignment.assignmentId}
                    value={String(assignment.assignmentId)}
                  >
                    {assignment.title}
                  </option>
                ))}

              </select>
            </label>

            <label className="grades-label">
              Internal Marks

              <input
                type="number"
                min="0"
                className="grades-input"
                placeholder="Internal marks"
                value={form.internalMarks}
                onChange={(e)=>
                  setForm({
                    ...form,
                    internalMarks:e.target.value,
                  })
                }
              />
            </label>

            <label className="grades-label">
              Semester Marks

              <input
                type="number"
                min="0"
                className="grades-input"
                placeholder="Semester marks"
                value={form.semesterMarks}
                onChange={(e)=>
                  setForm({
                    ...form,
                    semesterMarks:e.target.value,
                  })
                }
              />
            </label>

            <label className="grades-label">
              Assignment Marks

              <input
                type="number"
                required
                min="0"
                className="grades-input"
                placeholder="Assignment marks"
                value={form.assignmentMarks}
                onChange={(e)=>
                  setForm({
                    ...form,
                    assignmentMarks:e.target.value,
                  })
                }
              />
            </label>

            <label className="grades-label">
              Semester

              <input
                type="number"
                min="1"
                className="grades-input"
                placeholder="Semester"
                value={form.semester}
                onChange={(e)=>
                  setForm({
                    ...form,
                    semester:e.target.value,
                  })
                }
              />
            </label>

            <button
              className="grades-btn primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingGrade
                ? "Update Grade"
                : "Add Grade"}
            </button>

            {editingGrade && (

              <button
                type="button"
                className="grades-btn ghost"
                onClick={resetForm}
              >
                Cancel Edit
              </button>

            )}

          </form>

        </div>

      )}

      <div className="grades-card stats">

        <h5 className="grades-card-title">
          📈 Overview
        </h5>

        <div className="modern-stats-grid">

          <div className="modern-stat-card">
            <span>📚 Total Grades</span>
            <h2>{stats.total}</h2>
          </div>

          <div className="modern-stat-card">
            <span>📈 Average</span>
            <h2>{stats.avg}</h2>
          </div>

          <div className="modern-stat-card">
            <span>🏆 Highest</span>
            <h2>{stats.max}</h2>
          </div>

          <div className="modern-stat-card">
            <span>🎯 GPA</span>
            <h2>
              {Number(studentProfile?.gpa || 0).toFixed(2)}
            </h2>
          </div>

        </div>

      </div>

    </div>

    <div className="grades-list-card">

      <div className="grades-list-header">

        <h5 className="grades-card-title">
          🎓 Student Grades
        </h5>

        <span className="grades-count">
          {grades.length} entries
        </span>

      </div>

      {grades.length===0 ? (

        <div className="grades-empty">
          No grades yet.
        </div>

      ) : (

        <div className="grades-list">

          {grades.map((grade)=>{

            const assignment =
              assignmentMap.get(
                String(grade.assignmentId)
              );

            const maxMarks =
              assignment?.maxMarks ?? null;

            const currentScore =
              grade.marks ??
              grade.score ??
              grade.assignmentMarks ??
              0;

            const progress =
              maxMarks
                ? Math.min(
                    100,
                    Math.round(
                      (Number(currentScore)/maxMarks)*100
                    )
                  )
                : null;

            return (

              <div
                key={grade.gradeId}
                className="grades-item"
              >

                <div className="grades-item-main">

                  <div className="grades-item-title">
                    📘 {
                      assignment?.title ||
                      `Assignment #${grade.assignmentId}`
                    }
                  </div>

                  <div className="grades-item-meta">
                    ID: {grade.assignmentId}
                    {grade.semester
                      ? ` · Sem ${grade.semester}`
                      : ""}
                  </div>

                  {grade.feedback && (
                    <div className="grades-item-meta">
                      Feedback: {grade.feedback}
                    </div>
                  )}

                </div>

                <div className="grades-item-score">

                  <div className="grades-score-pill">
                    🎯 {currentScore}
                    {maxMarks
                      ? ` / ${maxMarks}`
                      : ""}
                  </div>

                  {progress !== null && (

                    <div className="grades-progress">

                      <div
                        className="grades-progress-bar"
                        style={{
                          width:`${progress}%`,
                        }}
                      ></div>

                    </div>

                  )}

                  {isTeacher && (

                    <div className="grades-item-actions">

                      <button
                        type="button"
                        className="grades-small-btn edit"
                        onClick={() =>
                          handleEditGrade(grade)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="grades-small-btn delete"
                        onClick={() =>
                          handleDeleteGrade(
                            grade.gradeId,
                            grade.studentId
                          )
                        }
                      >
                        Delete
                      </button>

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

        <h5 className="grades-card-title">
          📊 Performance Chart
        </h5>

        <StudentChart grades={grades} />

      </div>

    )}

  </div>
);

      
}