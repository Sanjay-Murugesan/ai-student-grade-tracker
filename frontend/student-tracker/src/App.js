import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import GradesPage from "./pages/GradesPage";
import AIPredictPage from "./pages/AIPredictPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/ai" element={<AIPredictPage />} />
      </Routes>
    </BrowserRouter>
  );
}
