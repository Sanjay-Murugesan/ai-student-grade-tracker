import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAiPrediction, getGradesByStudent, getStudentByUserId } from "../services/api";
import { average, riskMeta } from "../utils/portal";
import "../styles/portal.css";

export default function AIInsightsPage() {
  const { user } = useContext(AuthContext);
  const [studentId, setStudentId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function preloadStudent() {
      if (!user?.id || user?.role !== "STUDENT") {
        setLoading(false);
        return;
      }

      try {
        const studentResponse = await getStudentByUserId(user.id);
        const detectedId = studentResponse?.data?.studentId;

        if (!active) return;
        if (!detectedId) {
          setLoading(false);
          return;
        }

        setStudentId(String(detectedId));
        const [predictionResponse, gradeResponse] = await Promise.all([
          getAiPrediction(detectedId).catch(() => null),
          getGradesByStudent(detectedId).catch(() => null),
        ]);

        if (!active) return;
        setPrediction(predictionResponse?.data || null);
        setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
      } catch (err) {
        if (!active) return;
        console.error("AI insights preload failed", err);
        setError("We could not load AI insights for this profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    preloadStudent();
    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  async function handleLookup(event) {
    event.preventDefault();
    if (!studentId.trim()) return;

    try {
      setLoading(true);
      setError("");
      const [predictionResponse, gradeResponse] = await Promise.all([
        getAiPrediction(studentId.trim()),
        getGradesByStudent(studentId.trim()).catch(() => null),
      ]);

      setPrediction(predictionResponse?.data || null);
      setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
    } catch (err) {
      console.error("AI insights lookup failed", err);
      setPrediction(null);
      setGrades([]);
      setError(
        err?.response?.data?.error ||
          "Prediction lookup failed. Ensure the AI service is available and the student has grades."
      );
    } finally {
      setLoading(false);
    }
  }

  const scoreAverage = useMemo(() => average(grades.map((grade) => Number(grade.score) || 0)), [grades]);
  const trend = useMemo(() => {
    if (grades.length < 2) return "We need more grade data before a trend can be inferred.";

    const ordered = [...grades].sort((left, right) => new Date(left.gradedAt || 0) - new Date(right.gradedAt || 0));
    const firstHalf = ordered.slice(0, Math.ceil(ordered.length / 2));
    const secondHalf = ordered.slice(Math.ceil(ordered.length / 2));
    const earlierAverage = average(firstHalf.map((grade) => Number(grade.score) || 0));
    const laterAverage = average(secondHalf.map((grade) => Number(grade.score) || 0));

    if (laterAverage > earlierAverage) return "Recent grades are trending upward, which is a positive sign.";
    if (laterAverage < earlierAverage) return "Recent grades dipped compared with earlier work, so intervention may help.";
    return "The trend is currently stable across recorded grades.";
  }, [grades]);

  const risk = riskMeta(prediction?.risk);

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Interpretation layer</div>
          <h1>AI insights</h1>
          <p>
            View the prediction in context with actual grades so the guidance feels actionable instead
            of abstract.
          </p>
        </div>
        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{user?.role === "INSTRUCTOR" ? "Lookup any student" : "Your performance lens"}</strong>
            <p>Predictions are strongest when backed by multiple grade entries.</p>
          </div>
        </div>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Student lookup</h3>
            <p className="portal-card-subtitle">Use a student ID to inspect the current AI prediction and grade context.</p>
          </div>
        </div>

        <form className="portal-inline-form" onSubmit={handleLookup}>
          <div className="portal-field">
            <label htmlFor="insightStudentId">Student ID</label>
            <input
              id="insightStudentId"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              placeholder="Enter a student ID"
            />
          </div>
          <button className="portal-button primary" disabled={loading} type="submit">
            {loading ? "Loading..." : "Load insights"}
          </button>
        </form>

        {error ? <div className="portal-error" style={{ marginTop: 16 }}>{error}</div> : null}
      </section>

      {prediction ? (
        <section className="portal-grid-equal">
          <article className="portal-card">
            <div className="portal-card-header">
              <div>
                <h3 className="portal-card-title">Prediction summary</h3>
                <p className="portal-card-subtitle">The latest score forecast returned by the AI engine.</p>
              </div>
              <span className={`portal-pill ${risk.tone}`}>{risk.label}</span>
            </div>

            <div className="portal-kpi-grid">
              <div className="portal-kpi">
                <strong>{Math.round(Number(prediction.predictedScore) || 0)}%</strong>
                <span>Predicted score</span>
              </div>
              <div className="portal-kpi">
                <strong>{scoreAverage}</strong>
                <span>Average of saved grades</span>
              </div>
              <div className="portal-kpi">
                <strong>{grades.length}</strong>
                <span>Grade records analyzed</span>
              </div>
            </div>

            <div className="portal-banner" style={{ marginTop: 18, background: risk.soft }}>
              <h3>Recommendation</h3>
              <p>{prediction.suggestion || "No additional recommendation was returned."}</p>
            </div>
          </article>

          <article className="portal-card">
            <div className="portal-card-header">
              <div>
                <h3 className="portal-card-title">Interpretation</h3>
                <p className="portal-card-subtitle">Use the prediction together with current grade evidence.</p>
              </div>
            </div>

            <div className="portal-stack">
              <div className="portal-list-item">
                <div>
                  <strong>Trend</strong>
                  <p>{trend}</p>
                </div>
              </div>
              <div className="portal-list-item">
                <div>
                  <strong>Confidence cue</strong>
                  <p>
                    {grades.length >= 4
                      ? "There is enough data to treat this as a meaningful directional signal."
                      : "This prediction is still early, so use it as a soft warning rather than a firm conclusion."}
                  </p>
                </div>
              </div>
              <div className="portal-list-item">
                <div>
                  <strong>Best next move</strong>
                  <p>
                    {risk.tone === "danger"
                      ? "Intervene quickly with review, support, or direct instructor follow-up."
                      : risk.tone === "warning"
                      ? "Keep a close eye on the next assignment and reinforce weak areas now."
                      : "Maintain the current pace and keep reinforcing consistent study habits."}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="portal-card">
          <div className="portal-empty">
            <h4>No AI insight loaded yet</h4>
            <p>Enter a student ID above to load the latest prediction and its context.</p>
          </div>
        </section>
      )}
    </div>
  );
}
