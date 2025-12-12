import React, { useEffect, useState } from "react";
import { getStudents, getAssignments } from "../services/api";
import { Bar } from "react-chartjs-2";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getStudents().then(r => setStudents(r.data));
    getAssignments().then(r => setAssignments(r.data));
  }, []);

  const chartData = {
    labels: ["Students", "Assignments"],
    datasets: [{
      label: "Overview",
      data: [students.length, assignments.length],
      backgroundColor: ["#4e73df", "#1cc88a"]
    }]
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">📊 Dashboard</h2>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow p-3 text-center">
            <h5>Total Students</h5>
            <h2 className="fw-bold">{students.length}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow p-3 text-center">
            <h5>Total Assignments</h5>
            <h2 className="fw-bold">{assignments.length}</h2>
          </div>
        </div>
      </div>

      <div className="card shadow mt-5 p-3">
        <h5 className="fw-bold">System Analytics</h5>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
