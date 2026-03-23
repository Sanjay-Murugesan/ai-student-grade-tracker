import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAssignments, getCourses, getGrades, getStudents } from "../services/api";
import { average, daysUntil, formatDisplayDate } from "../utils/portal";
import "../styles/portal.css";

export default function TeacherDashboardPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [studentResponse, assignmentResponse, gradeResponse, courseResponse] = await Promise.all([
          getStudents(),
          getAssignments(),
          getGrades(),
          getCourses().catch(() => null),
        ]);

        if (!active) return;

        setStudents(Array.isArray(studentResponse?.data) ? studentResponse.data : []);
        setAssignments(Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : []);
        setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
        setCourses(Array.isArray(courseResponse?.data) ? courseResponse.data : []);
      } catch (err) {
        if (!active) return;
        console.error("Teacher dashboard load failed", err);
        setError("We could not load the teaching dashboard right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const assignmentAverages = useMemo(() => {
    const byAssignment = new Map();

    grades.forEach((grade) => {
      const key = String(grade.assignmentId);
      const scores = byAssignment.get(key) || [];
      scores.push(Number(grade.score) || 0);
      byAssignment.set(key, scores);
    });

    return assignments
      .map((assignment) => ({
        ...assignment,
        average: average(byAssignment.get(String(assignment.assignmentId)) || []),
        submissions: (byAssignment.get(String(assignment.assignmentId)) || []).length,
      }))
      .sort((left, right) => right.average - left.average);
  }, [assignments, grades]);

  const lowCoverageAssignments = useMemo(() => {
    return assignmentAverages
      .filter((assignment) => {
        const remaining = daysUntil(assignment.dueDate);
        return remaining !== null && remaining < 0 && assignment.submissions === 0;
      })
      .slice(0, 4);
  }, [assignmentAverages]);

  const upcomingAssignments = useMemo(() => {
    return [...assignments]
      .filter((assignment) => {
        const remaining = daysUntil(assignment.dueDate);
        return remaining !== null && remaining >= 0;
      })
      .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
      .slice(0, 5);
  }, [assignments]);

  const courseNameById = useMemo(() => {
    const map = new Map();
    courses.forEach((course) => {
      map.set(String(course.courseId), course.courseName);
    });
    return map;
  }, [courses]);

  const classAverage = average(grades.map((grade) => Number(grade.score) || 0));
  const overdueAssignments = assignments.filter((assignment) => {
    const remaining = daysUntil(assignment.dueDate);
    return remaining !== null && remaining < 0;
  }).length;

  if (loading) {
    return (
      <div className="portal-page">
        <div className="portal-hero">
          <div className="portal-hero-copy">
            <div className="portal-kicker">Instructor Workspace</div>
            <h1>Preparing your teaching dashboard...</h1>
            <p>Class data, grading activity, and course performance are loading.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Instructor Workspace</div>
          <h1>{`Welcome back, ${user?.name || user?.username || "Instructor"}`}</h1>
          <p>
            This control center gives you a sharper view of classroom activity, pending grading work,
            and where students may need support.
          </p>
        </div>

        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{formatDisplayDate(new Date(), { weekday: "long", month: "long", day: "numeric" })}</strong>
            <p>{`${courses.length} course${courses.length === 1 ? "" : "s"} visible in the system`}</p>
          </div>
          <span className="portal-pill info">Instructor dashboard</span>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}

      <section className="portal-stat-grid">
        <article className="portal-stat">
          <div className="portal-stat-label">Students</div>
          <div className="portal-stat-value">{students.length}</div>
          <div className="portal-stat-note">Learners currently visible across the tracker.</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Assignments</div>
          <div className="portal-stat-value">{assignments.length}</div>
          <div className="portal-stat-note">Published assignment records in the backend.</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Class average</div>
          <div className="portal-stat-value">{classAverage}</div>
          <div className="portal-stat-note">Average raw score across all grade entries.</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Overdue</div>
          <div className="portal-stat-value">{overdueAssignments}</div>
          <div className="portal-stat-note">Assignments with due dates already behind us.</div>
        </article>
      </section>

      <section className="portal-grid-2">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Classroom watchlist</h3>
              <p className="portal-card-subtitle">Fast checks for places that may need attention this week.</p>
            </div>
            <div className="portal-actions">
              <Link className="portal-button soft" to="/grades">
                Open grades
              </Link>
              <Link className="portal-button primary" to="/course-analytics">
                Course analytics
              </Link>
            </div>
          </div>

          <div className="portal-kpi-grid">
            <div className="portal-kpi">
              <strong>{lowCoverageAssignments.length}</strong>
              <span>Past-due assignments with no grade entries yet</span>
            </div>
            <div className="portal-kpi">
              <strong>{grades.length}</strong>
              <span>Total grade records saved so far</span>
            </div>
            <div className="portal-kpi">
              <strong>{courses.length}</strong>
              <span>Active courses available for review</span>
            </div>
          </div>

          <div className="portal-stack" style={{ marginTop: 16 }}>
            {lowCoverageAssignments.length ? (
              lowCoverageAssignments.map((assignment) => (
                <div className="portal-list-item" key={assignment.assignmentId}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <p>{courseNameById.get(String(assignment.courseId)) || "General assignment"}</p>
                  </div>
                  <div>
                    <span className="portal-pill danger">Needs grading activity</span>
                    <p>{`Due ${formatDisplayDate(assignment.dueDate)}`}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="portal-empty">
                <h4>No urgent watchlist items</h4>
                <p>The current data does not show any past-due assignments without grading activity.</p>
              </div>
            )}
          </div>
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Upcoming schedule</h3>
              <p className="portal-card-subtitle">The next deadlines likely to shape student workload.</p>
            </div>
            <Link className="portal-button soft" to="/assignments">
              Manage assignments
            </Link>
          </div>

          {upcomingAssignments.length ? (
            <div className="portal-stack">
              {upcomingAssignments.map((assignment) => {
                const remaining = daysUntil(assignment.dueDate);
                return (
                  <div className="portal-list-item" key={assignment.assignmentId}>
                    <div>
                      <strong>{assignment.title}</strong>
                      <p>{courseNameById.get(String(assignment.courseId)) || "No course label"}</p>
                    </div>
                    <div>
                      <span className={`portal-pill ${remaining <= 2 ? "warning" : "info"}`}>
                        {remaining === 0 ? "Due today" : `${remaining} days left`}
                      </span>
                      <p>{formatDisplayDate(assignment.dueDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="portal-empty">
              <h4>No upcoming deadlines</h4>
              <p>You currently do not have dated assignments coming up next.</p>
            </div>
          )}
        </article>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Assignment performance snapshot</h3>
            <p className="portal-card-subtitle">Top and low-performing assignment averages from the current gradebook.</p>
          </div>
        </div>

        {assignmentAverages.length ? (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Average score</th>
                <th>Grade entries</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {assignmentAverages.slice(0, 8).map((assignment) => (
                <tr key={assignment.assignmentId}>
                  <td>{assignment.title}</td>
                  <td className="portal-muted">
                    {courseNameById.get(String(assignment.courseId)) || "Not linked"}
                  </td>
                  <td>{assignment.average}</td>
                  <td>{assignment.submissions}</td>
                  <td className="portal-muted">{formatDisplayDate(assignment.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="portal-empty">
            <h4>No assignment analytics yet</h4>
            <p>Once assignments and grades are added, this table will show a cleaner performance view.</p>
          </div>
        )}
      </section>
    </div>
  );
}
