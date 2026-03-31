import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentGrades from "./pages/student/StudentGrades";
import StudentAssignments from "./pages/student/StudentAssignments";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentRoster from "./pages/teacher/StudentRoster";
import GradeManagement from "./pages/teacher/GradeManagement";
import AssignmentManagement from "./pages/teacher/AssignmentManagement";
import StudentDetails from "./pages/teacher/StudentDetails";

function RoleHomeRedirect() {
  const auth = useAuth();
  return <Navigate to={auth.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard"} replace />;
}

function UnauthorizedPage() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">Access Control</p>
        <h1>Access Denied</h1>
        <p>This route does not match your current role permissions.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleHomeRedirect />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/grades"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <StudentGrades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignments"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <StudentAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/roster"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <StudentRoster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/grades"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <GradeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <AssignmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/student/:id"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <StudentDetails />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
