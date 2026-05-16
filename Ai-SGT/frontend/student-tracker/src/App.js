// ================= IMPORTS =================

import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";

import ProtectedRoute from "./context/ProtectedRoute";
import RoleRoute from "./context/RoleRoute";

import "./App.css";

import ProtectedLayout from "./layouts/ProtectedLayout";

// ================= PAGES =================

import StudentDashboardPage from "./pages/StudentDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";

import StudentsPage from "./pages/StudentsPage";
import SubmissionsPage from "./pages/SubmissionsPage";

import AssignmentsPage from "./pages/AssignmentsPage";
import GradesPage from "./pages/GradesPage";
import AttendancePage from "./pages/AttendancePage";

import AIPredictPage from "./pages/AIPredictPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import CourseAnalyticsPage from "./pages/CourseAnalyticsPage";

import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

// ================= AUTH PAGES =================

import StudentLoginPage from "./pages/StudentLoginPage";
import StudentSignupPage from "./pages/StudentSignupPage";

import InstructorLoginPage from "./pages/InstructorLoginPage";
import InstructorSignupPage from "./pages/InstructorSignupPage";

// ================= APP =================

export default function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* ================= AUTH ROUTES ================= */}

          <Route
            path="/login"
            element={<StudentLoginPage />}
          />

          <Route
            path="/signup"
            element={<StudentSignupPage />}
          />

          <Route
            path="/instructor-login"
            element={<InstructorLoginPage />}
          />

          <Route
            path="/instructor-signup"
            element={<InstructorSignupPage />}
          />

          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >

            {/* ================= DASHBOARD REDIRECT ================= */}

            <Route
              path="/"
              element={
                <RoleRoute>
                  <RedirectDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RoleRoute>
                  <RedirectDashboard />
                </RoleRoute>
              }
            />

            {/* ================= STUDENT DASHBOARD ================= */}

            <Route
              path="/student/dashboard"
              element={
                <RoleRoute allowed={["STUDENT"]}>
                  <StudentDashboardPage />
                </RoleRoute>
              }
            />

            {/* ================= INSTRUCTOR DASHBOARD ================= */}

            <Route
              path="/teacher/dashboard"
              element={
                <RoleRoute allowed={["INSTRUCTOR"]}>
                  <TeacherDashboardPage />
                </RoleRoute>
              }
            />

            {/* ================= STUDENTS PAGE ================= */}

            <Route
              path="/teacher/students"
              element={
                <RoleRoute allowed={["INSTRUCTOR"]}>
                  <StudentsPage />
                </RoleRoute>
              }
            />

            {/* ================= SUBMISSIONS PAGE ================= */}

            <Route
              path="/teacher/submissions"
              element={
                <RoleRoute allowed={["INSTRUCTOR"]}>
                  <SubmissionsPage />
                </RoleRoute>
              }
            />

            {/* ================= COMMON PAGES ================= */}

            <Route
              path="/assignments"
              element={<AssignmentsPage />}
            />

            <Route
              path="/grades"
              element={<GradesPage />}
            />

            <Route
              path="/attendance"
              element={<AttendancePage />}
            />

            <Route
              path="/ai-predict"
              element={<AIPredictPage />}
            />

            <Route
              path="/ai-insights"
              element={<AIInsightsPage />}
            />

            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            {/* ================= INSTRUCTOR ONLY ================= */}

            <Route
              path="/course-analytics"
              element={
                <RoleRoute allowed={["INSTRUCTOR"]}>
                  <CourseAnalyticsPage />
                </RoleRoute>
              }
            />

          </Route>

          {/* ================= FALLBACK ================= */}

          <Route
            path="*"
            element={<Navigate to="/login" />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  );
}

// ================= ROLE REDIRECT =================

function RedirectDashboard() {

  const { user } = useContext(AuthContext);

  if (user?.role === "INSTRUCTOR") {

    return (
      <Navigate
        to="/teacher/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/student/dashboard"
      replace
    />
  );
}