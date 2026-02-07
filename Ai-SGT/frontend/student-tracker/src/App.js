  import React from "react";
  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
  import { AuthProvider, AuthContext } from "./context/AuthContext";
  import ProtectedRoute from "./context/ProtectedRoute";

  import Navbar from "./components/Navbar";
  import DashboardPage from "./pages/DashboardPage";
  import AssignmentsPage from "./pages/AssignmentsPage";
  import GradesPage from "./pages/GradesPage";
  import AIPredictPage from "./pages/AIPredictPage";
  import ProfilePage from "./pages/ProfilePage";
  import StudentLoginPage from "./pages/StudentLoginPage";
  import StudentSignupPage from "./pages/StudentSignupPage";
  import InstructorLoginPage from "./pages/InstructorLoginPage";
  import InstructorSignupPage from "./pages/InstructorSignupPage";

  function AppRoutes() {
    const { isAuthenticated } = React.useContext(AuthContext);

    return (
      <>
        {isAuthenticated && <Navbar />}
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<StudentLoginPage />} />
          <Route path="/signup" element={<StudentSignupPage />} />
          <Route path="/instructor-login" element={<InstructorLoginPage />} />
          <Route path="/instructor-signup" element={<InstructorSignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <AssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grades"
            element={
              <ProtectedRoute>
                <GradesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-predict"
            element={
              <ProtectedRoute>
                <AIPredictPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </>
    );
  }

  export default function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    );
  }
