import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function StudentChart({ grades }) {
  const labels = grades.map((g, i) => `A${g.assignmentId}`);
  const data = {
    labels,
    datasets: [
      {
        label: "Score",
        data: grades.map((g) => g.score),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        borderWidth: 3,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={data} />
    </div>
  );
}
