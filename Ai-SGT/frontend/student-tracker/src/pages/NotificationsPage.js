import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAiPrediction,
  getAssignments,
  getGrades,
  getGradesByStudent,
  getStudentByUserId,
  getStudents,
} from "../services/api";
import { daysUntil, formatDisplayDate, percentage, riskMeta } from "../utils/portal";
import "../styles/portal.css";

function buildStudentAlerts(assignments, grades, prediction) {
  const alerts = [];
  const assignmentMap = new Map(assignments.map((assignment) => [String(assignment.assignmentId), assignment]));

  assignments.forEach((assignment) => {
    const remaining = daysUntil(assignment.dueDate);
    if (remaining !== null && remaining < 0) {
      alerts.push({
        id: `overdue-${assignment.assignmentId}`,
        title: `${assignment.title} is overdue`,
        body: "Prioritize this task first so it does not keep dragging your progress down.",
        tone: "danger",
        date: assignment.dueDate,
      });
    } else if (remaining !== null && remaining <= 2) {
      alerts.push({
        id: `soon-${assignment.assignmentId}`,
        title: `${assignment.title} is due soon`,
        body: "This deadline is close. A small push now will prevent last-minute stress.",
        tone: "warning",
        date: assignment.dueDate,
      });
    }
  });

  grades.forEach((grade) => {
    const assignment = assignmentMap.get(String(grade.assignmentId));
    const score = percentage(grade.score, assignment?.maxMarks || 100);
    if (score < 60) {
      alerts.push({
        id: `grade-${grade.gradeId}`,
        title: `Low score in ${assignment?.title || "an assignment"}`,
        body: `Your latest recorded result landed at ${score} percent. Review that topic before the next assessment.`,
        tone: "warning",
        date: grade.gradedAt,
      });
    }
  });

  if (prediction?.risk) {
    const risk = riskMeta(prediction.risk);
    alerts.push({
      id: "ai-risk",
      title: `AI status: ${risk.label}`,
      body: prediction.suggestion || "Prediction available. Review it for study guidance.",
      tone: risk.tone,
      date: new Date().toISOString(),
    });
  }

  return alerts.sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));
}

function buildInstructorAlerts(assignments, grades, students) {
  const alerts = [];

  const overdue = assignments.filter((assignment) => {
    const remaining = daysUntil(assignment.dueDate);
    return remaining !== null && remaining < 0;
  });

  if (overdue.length) {
    alerts.push({
      id: "overdue-summary",
      title: `${overdue.length} assignment${overdue.length === 1 ? "" : "s"} past due`,
      body: "Review whether grading has started and whether students need follow-up reminders.",
      tone: "danger",
      date: overdue[0].dueDate,
    });
  }

  const lowClassGrades = grades.filter((grade) => Number(grade.score) < 50);
  if (lowClassGrades.length) {
    alerts.push({
      id: "low-grade-summary",
      title: `${lowClassGrades.length} low score${lowClassGrades.length === 1 ? "" : "s"} recorded`,
      body: "Consider whether a concept review or extra support session would help.",
      tone: "warning",
      date: new Date().toISOString(),
    });
  }

  if (students.length && !grades.length) {
    alerts.push({
      id: "no-grade-data",
      title: "Student roster exists without grade data",
      body: "Once instructors begin entering marks, richer teaching analytics will appear automatically.",
      tone: "info",
      date: new Date().toISOString(),
    });
  }

  return alerts.sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));
}

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        if (user?.role === "STUDENT" && user?.id) {
          const studentResponse = await getStudentByUserId(user.id);
          const studentId = studentResponse?.data?.studentId;
          const [assignmentResponse, gradeResponse, predictionResponse] = await Promise.all([
            getAssignments(),
            studentId ? getGradesByStudent(studentId) : Promise.resolve(null),
            studentId ? getAiPrediction(studentId).catch(() => null) : Promise.resolve(null),
          ]);

          if (!active) return;

          const nextAlerts = buildStudentAlerts(
            Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : [],
            Array.isArray(gradeResponse?.data) ? gradeResponse.data : [],
            predictionResponse?.data || null
          );
          setAlerts(nextAlerts);
        } else {
          const [assignmentResponse, gradeResponse, studentResponse] = await Promise.all([
            getAssignments(),
            getGrades(),
            getStudents(),
          ]);

          if (!active) return;

          const nextAlerts = buildInstructorAlerts(
            Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : [],
            Array.isArray(gradeResponse?.data) ? gradeResponse.data : [],
            Array.isArray(studentResponse?.data) ? studentResponse.data : []
          );
          setAlerts(nextAlerts);
        }
      } catch (err) {
        if (!active) return;
        console.error("Notifications load failed", err);
        setError("We could not build the notifications feed right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAlerts();
    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  const counts = useMemo(() => {
    return {
      all: alerts.length,
      danger: alerts.filter((alert) => alert.tone === "danger").length,
      warning: alerts.filter((alert) => alert.tone === "warning").length,
      info: alerts.filter((alert) => alert.tone === "info").length,
    };
  }, [alerts]);

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Updates feed</div>
          <h1>Notifications</h1>
          <p>
            This page collects the most important reminders and signals from your current academic data,
            so the next action is easier to spot.
          </p>
        </div>
        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{counts.all}</strong>
            <p>Total items in this feed right now</p>
          </div>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}

      <section className="portal-stat-grid">
        <article className="portal-stat">
          <div className="portal-stat-label">Total</div>
          <div className="portal-stat-value">{counts.all}</div>
          <div className="portal-stat-note">All current alert items</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Critical</div>
          <div className="portal-stat-value">{counts.danger}</div>
          <div className="portal-stat-note">Highest urgency alerts</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">Attention</div>
          <div className="portal-stat-value">{counts.warning}</div>
          <div className="portal-stat-note">Items worth checking soon</div>
        </article>
        <article className="portal-stat">
          <div className="portal-stat-label">System notes</div>
          <div className="portal-stat-value">{counts.info}</div>
          <div className="portal-stat-note">Helpful informational items</div>
        </article>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Recent alerts</h3>
            <p className="portal-card-subtitle">The newest items are shown first.</p>
          </div>
        </div>

        {loading ? (
          <div className="portal-empty">
            <h4>Loading notifications...</h4>
            <p>Your current alerts are being assembled.</p>
          </div>
        ) : alerts.length ? (
          <div className="portal-stack">
            {alerts.map((alert) => (
              <div className="portal-list-item" key={alert.id}>
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.body}</p>
                </div>
                <div>
                  <span className={`portal-pill ${alert.tone}`}>{alert.tone}</span>
                  <p>{formatDisplayDate(alert.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="portal-empty">
            <h4>No notifications right now</h4>
            <p>Your data does not currently show anything urgent or noteworthy.</p>
          </div>
        )}
      </section>
    </div>
  );
}
