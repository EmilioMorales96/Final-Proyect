import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user } = useAuth();

  // If there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, show the protected content
  return <Outlet />;
}