import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole?: string;
}) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log("Role mismatch:", { role, requiredRole });
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
