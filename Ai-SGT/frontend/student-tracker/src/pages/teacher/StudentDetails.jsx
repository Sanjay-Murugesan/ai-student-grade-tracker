import React from "react";
import { useLocation } from "react-router-dom";

export default function StudentDetails() {
  const location = useLocation();
  const studentId = location.pathname.split("/").pop();

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">Student Drilldown</p>
        <h2>Student #{studentId}</h2>
        <p>This placeholder route is ready for a deeper student profile expansion from the roster screen.</p>
      </section>
    </div>
  );
}
