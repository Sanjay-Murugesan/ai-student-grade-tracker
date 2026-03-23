import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getAiPrediction,
  getAssignments,
  getGradesByStudent,
  getStudentByUserId,
} from "../services/api";
import {
  average,
  daysUntil,
  formatDisplayDate,
  percentage,
  riskMeta,
} from "../utils/portal";
import "../styles/portal.css";

export default function StudentDashboardPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const studentResponse = await getStudentByUserId(user.id);
        const studentRecord = studentResponse?.data || null;

        if (!active) return;

        setStudent(studentRecord);

        const [assignmentResponse, gradeResponse, predictionResponse] = await Promise.all([
          getAssignments(),
          studentRecord?.studentId ? getGradesByStudent(studentRecord.studentId) : Promise.resolve(null),
          studentRecord?.studentId ? getAiPrediction(studentRecord.studentId).catch(() => null) : Promise.resolve(null),
        ]);

        if (!active) return;

        setAssignments(Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : []);
        setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
        setPrediction(predictionResponse?.data || null);
      } catch (err) {
        if (!active) return;
        console.error("Student dashboard load failed", err);
        setError("We could not load your dashboard right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const assignmentMap = useMemo(() => {
    const map = new Map();
    assignments.forEach((assignment) => {
      map.set(String(assignment.assignmentId), assignment);
    });
    return map;
  }, [assignments]);

  const dueSoon = useMemo(() => {
    return [...assignments]
      .filter((assignment) => {
        const remaining = daysUntil(assignment.dueDate);
        return remaining !== null && remaining >= 0;
      })
      .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
      .slice(0, 5);
  }, [assignments]);

  const overdueCount = useMemo(() => {
    return assignments.filter((assignment) => {
      const remaining = daysUntil(assignment.dueDate);
      return remaining !== null && remaining < 0;
    }).length;
  }, [assignments]);

  const averageGrade = useMemo(() => {
    const gradePercentages = grades.map((grade) => {
      const assignment = assignmentMap.get(String(grade.assignmentId));
      return percentage(grade.score, assignment?.maxMarks || 100);
    });
    return average(gradePercentages);
  }, [assignmentMap, grades]);

  const completionRate = useMemo(() => {
    if (!assignments.length) return 0;
    return Math.round((grades.length / assignments.length) * 100);
  }, [assignments.length, grades.length]);

  const recentGrades = useMemo(() => {
    return [...grades]
      .sort((left, right) => new Date(right.gradedAt || 0) - new Date(left.gradedAt || 0))
      .slice(0, 4);
  }, [grades]);

  const risk = riskMeta(prediction?.risk);

  if (loading) {
    return (
      <div className="portal-page">
        <div className="portal-hero">
          <div className="portal-hero-copy">
            <div className="portal-kicker">Student Workspace</div>
            <h1>Loading your dashboard...</h1>
            <p>Your assignments, grades, and AI summary are being prepared.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Student Workspace</div>
          <h1>{`Welcome back, ${student?.name || user?.name || user?.username || "Student"}`}</h1>
          <p>
            Keep your momentum high with a clear view of deadlines, recent results, and AI guidance
            based on your current grade history.
          </p>
        </div>

        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{formatDisplayDate(new Date(), { weekday: "long", month: "long", day: "numeric" })}</strong>
            <p>{student?.studentId ? `Student ID ${student.studentId}` : "Student profile still syncing"}</p>
          </div>
          <span className={`portal-pill ${risk.tone}`}>{risk.label}</span>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}

      <section className="portal-stat-grid">
        <article className="portal-stat">
          <div className="portal-stat-label">Assignments</div>
          <div className="portal-stat-value">{assignments.length}</div>
          <div className="portal-stat-note">All active coursework currently visible in the tracker.</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Average grade</div>
          <div className="portal-stat-value">{averageGrade}%</div>
          <div className="portal-stat-note">Calculated from your graded assignments so far.</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Completion</div>
          <div className="portal-stat-value">{completionRate}%</div>
          <div className="portal-stat-note">{`${grades.length} graded item${grades.length === 1 ? "" : "s"} recorded`}</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Overdue</div>
          <div className="portal-stat-value">{overdueCount}</div>
          <div className="portal-stat-note">
            {overdueCount ? "Start with the oldest due date first." : "No late work showing right now."}
          </div>
        </article>
      </section>

      <section className="portal-grid-2">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Due next</h3>
              <p className="portal-card-subtitle">The nearest deadlines that deserve attention first.</p>
            </div>
            <Link className="portal-button soft" to="/assignments">
              Open assignments
            </Link>
          </div>

          {dueSoon.length ? (
            <div className="portal-stack">
              {dueSoon.map((assignment) => {
                const remaining = daysUntil(assignment.dueDate);
                const tone = remaining <= 1 ? "danger" : remaining <= 3 ? "warning" : "info";

                return (
                  <div className="portal-list-item" key={assignment.assignmentId}>
                    <div>
                      <strong>{assignment.title}</strong>
                      <p>{assignment.description || "No description provided yet."}</p>
                    </div>
                    <div>
                      <span className={`portal-pill ${tone}`}>
                        {remaining === 0 ? "Due today" : `${remaining} day${remaining === 1 ? "" : "s"} left`}
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
              <p>Your schedule is clear right now.</p>
            </div>
          )}
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Recent grades</h3>
              <p className="portal-card-subtitle">A quick pulse check on how your latest work landed.</p>
            </div>
            <Link className="portal-button soft" to="/grades">
              View all grades
            </Link>
          </div>

          {recentGrades.length ? (
            <div className="portal-stack">
              {recentGrades.map((grade) => {
                const assignment = assignmentMap.get(String(grade.assignmentId));
                const score = percentage(grade.score, assignment?.maxMarks || 100);
                const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";

                return (
                  <div className="portal-list-item" key={grade.gradeId}>
                    <div>
                      <strong>{assignment?.title || `Assignment ${grade.assignmentId}`}</strong>
                      <p>{`Score ${grade.score}${assignment?.maxMarks ? ` / ${assignment.maxMarks}` : ""}`}</p>
                    </div>
                    <div>
                      <span className={`portal-pill ${tone}`}>{score}%</span>
                      <p>{formatDisplayDate(grade.gradedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="portal-empty">
              <h4>No grades yet</h4>
              <p>Your instructor has not published grade entries for you yet.</p>
            </div>
          )}
        </article>
      </section>

      <section className="portal-grid-equal">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">AI guidance</h3>
              <p className="portal-card-subtitle">Prediction details generated from your grade history.</p>
            </div>
            <Link className="portal-button primary" to="/ai-insights">
              Open AI insights
            </Link>
          </div>

          {prediction ? (
            <div className="portal-stack">
              <div className="portal-banner" style={{ background: risk.soft }}>
                <h3>{risk.label}</h3>
                <p>{prediction.suggestion || "No recommendation was returned yet."}</p>
              </div>

              <div className="portal-kpi-grid">
                <div className="portal-kpi">
                  <strong>{Math.round(Number(prediction.predictedScore) || 0)}%</strong>
                  <span>Predicted score</span>
                </div>
                <div className="portal-kpi">
                  <strong>{averageGrade}%</strong>
                  <span>Current average</span>
                </div>
                <div className="portal-kpi">
                  <strong>{completionRate}%</strong>
                  <span>Completion rate</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="portal-empty">
              <h4>No prediction yet</h4>
              <p>Run an AI prediction after a few grades are available to unlock recommendations.</p>
            </div>
          )}
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Study momentum</h3>
              <p className="portal-card-subtitle">A simple snapshot of how your term is pacing.</p>
            </div>
          </div>

          <div className="portal-stack">
            <div>
              <div className="portal-card-subtitle">Assignment coverage</div>
              <div className="portal-meter">
                <span style={{ width: `${completionRate}%` }} />
              </div>
            </div>
            <div>
              <div className="portal-card-subtitle">Grade strength</div>
              <div className="portal-meter">
                <span style={{ width: `${averageGrade}%` }} />
              </div>
            </div>
            <div className="portal-banner">
              <h3>What to do next</h3>
              <p>
                {overdueCount
                  ? "Clear late assignments first, then revisit the AI guidance page for a stronger prediction."
                  : dueSoon.length
                  ? "Your next best move is to finish the nearest deadline before it becomes urgent."
                  : "Use the free time to review older topics and push your average even higher."}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
