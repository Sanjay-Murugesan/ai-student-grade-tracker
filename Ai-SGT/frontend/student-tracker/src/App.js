import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import RoleRoute from "./context/RoleRoute";

import ProtectedLayout from "./layouts/ProtectedLayout";

// Pages
import StudentDashboardPage from "./pages/StudentDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import GradesPage from "./pages/GradesPage";
import AIPredictPage from "./pages/AIPredictPage";
import ProfilePage from "./pages/ProfilePage";

import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import InstructorLoginPage from "./pages/InstructorLoginPage";
import InstructorSignupPage from "./pages/InstructorSignupPage";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ================= AUTH ROUTES (NO NAV, NO FOOTER) ================= */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/signup" element={<StudentSignupPage />} />
          <Route path="/instructor-login" element={<InstructorLoginPage />} />
          <Route path="/instructor-signup" element={<InstructorSignupPage />} />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={<RoleRoute>{<RedirectDashboard />}</RoleRoute>}
            />
            <Route
              path="/dashboard"
              element={<RoleRoute>{<RedirectDashboard />}</RoleRoute>}
            />
            <Route
              path="/student/dashboard"
              element={
                <RoleRoute allowed={["STUDENT"]}>
                  <StudentDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="/teacher/dashboard"
              element={
                <RoleRoute allowed={["INSTRUCTOR"]}>
                  <TeacherDashboardPage />
                </RoleRoute>
              }
            />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/ai-predict" element={<AIPredictPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function RedirectDashboard() {
  const { user } = useContext(AuthContext);
  if (user?.role === "INSTRUCTOR") {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <Navigate to="/student/dashboard" replace />;
}
