import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // ignore
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user || user.role.toLowerCase() !== requiredRole.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
