import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function RoleRoute({ allowed, children }) {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (allowed && !allowed.includes(user.role)) {
    const redirectTo = user.role === "INSTRUCTOR" ? "/teacher/dashboard" : "/student/dashboard";
    return <Navigate to={redirectTo} />;
  }

  return children;
}
