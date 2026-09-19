import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAiPrediction, getStudentByUserId } from "../services/api";
import { riskMeta } from "../utils/portal";
import "../styles/portal.css";

export default function AIPredictPage() {
  const { user } = useContext(AuthContext);
  const [studentId, setStudentId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function hydrateStudentId() {
      if (!user?.id || user?.role !== "STUDENT") return;

      try {
        const response = await getStudentByUserId(user.id);
        if (active && response?.data?.studentId) {
          setStudentId(String(response.data.studentId));
        }
      } catch (err) {
        console.error("Failed to preload student id", err);
      }
    }

    hydrateStudentId();
    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!studentId.trim()) return;

    try {
      setLoading(true);
      setError("");
      const response = await getAiPrediction(studentId.trim());
      setPrediction(response?.data || null);
    } catch (err) {
      console.error("AI prediction failed", err);
      setPrediction(null);
      setError(
        err?.response?.data?.error ||
          "Prediction failed. Make sure the backend and AI engine are both running."
      );
    } finally {
      setLoading(false);
    }
  }

  const risk = riskMeta(prediction?.risk);

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Predictive support</div>
          <h1>AI performance prediction</h1>
          <p>
            Generate a score forecast from existing grades, then use the recommendation to decide
            what to work on next.
          </p>
        </div>

        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{user?.role === "INSTRUCTOR" ? "Instructor mode" : "Student mode"}</strong>
            <p>
              {user?.role === "INSTRUCTOR"
                ? "Run predictions for any student by ID."
                : "Your student ID is prefilled when available."}
            </p>
          </div>
        </div>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Run a prediction</h3>
            <p className="portal-card-subtitle">
              The AI engine uses saved grades from the backend to estimate the next score trend.
            </p>
          </div>
          <Link className="portal-button soft" to="/ai-insights">
            Open detailed insights
          </Link>
        </div>

        <form className="portal-inline-form" onSubmit={handleSubmit}>
          <div className="portal-field">
            <label htmlFor="studentId">Student ID</label>
            <input
              id="studentId"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              placeholder="Enter a numeric student ID"
            />
          </div>
          <button className="portal-button primary" disabled={loading} type="submit">
            {loading ? "Generating..." : "Generate prediction"}
          </button>
        </form>

        {error ? <div className="portal-error" style={{ marginTop: 16 }}>{error}</div> : null}
      </section>

      {prediction ? (
        <section className="portal-grid-equal">
          <article className="portal-card">
            <div className="portal-card-header">
              <div>
                <h3 className="portal-card-title">Prediction result</h3>
                <p className="portal-card-subtitle">Latest response returned by the AI service.</p>
              </div>
              <span className={`portal-pill ${risk.tone}`}>{risk.label}</span>
            </div>

            <div className="portal-kpi-grid">
              <div className="portal-kpi">
                <strong>{Math.round(Number(prediction.predictedScore) || 0)}%</strong>
                <span>Predicted score</span>
              </div>
              <div className="portal-kpi">
                <strong>{String(prediction.risk || "Unknown")}</strong>
                <span>Risk label</span>
              </div>
              <div className="portal-kpi">
                <strong>{studentId}</strong>
                <span>Student evaluated</span>
              </div>
            </div>

            <div className="portal-banner" style={{ marginTop: 18, background: risk.soft }}>
              <h3>Recommendation</h3>
              <p>{prediction.suggestion || "No study recommendation was returned."}</p>
            </div>
          </article>

          <article className="portal-card">
            <div className="portal-card-header">
              <div>
                <h3 className="portal-card-title">How to use this</h3>
                <p className="portal-card-subtitle">Turn the prediction into a practical next step.</p>
              </div>
            </div>

            <div className="portal-stack">
              <div className="portal-list-item">
                <div>
                  <strong>Review the weak area first</strong>
                  <p>Start with the assignment topics tied to the lowest recent grades.</p>
                </div>
              </div>
              <div className="portal-list-item">
                <div>
                  <strong>Re-run after new grades arrive</strong>
                  <p>Predictions become more useful as more grade records are saved in the system.</p>
                </div>
              </div>
              <div className="portal-list-item">
                <div>
                  <strong>Use insights, not fear</strong>
                  <p>The prediction is guidance for intervention, not a final judgment of performance.</p>
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="portal-card">
          <div className="portal-empty">
            <h4>No prediction generated yet</h4>
            <p>Run the form above to produce a score forecast and recommendation.</p>
          </div>
        </section>
      )}
    </div>
  );
}
