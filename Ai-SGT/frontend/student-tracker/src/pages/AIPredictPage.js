import React, { useState } from "react";
import { getAiPrediction } from "../services/api";

/**
 * AIPredictPage:
 * - Enter student ID
 * - Fetch predicted score from backend + AI engine
 */
export default function AIPredictPage() {
  const [studentId, setStudentId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    getAiPrediction(studentId)
      .then((res) => setResponse(res.data))
      .catch(() =>
        setResponse({ error: "Prediction failed. Ensure backend & AI are running." })
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">AI Performance Prediction</h2>

      <form onSubmit={fetchPrediction} className="card p-3 shadow-sm mb-3">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              required
              className="form-control"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </div>
      </form>

      {response && (
        <div className="card shadow-sm p-3">
          {response.error ? (
            <div className="text-danger">{response.error}</div>
          ) : (
            <>
              <h5>Predicted Score: {response.predictedScore}</h5>
              <p><strong>Risk Level:</strong> {response.risk}</p>
              <p><strong>Suggestion:</strong> {response.suggestion}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
