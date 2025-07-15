import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Protected route component that requires user authentication
 * Redirects unauthenticated users to login page
 * 
 * Used to wrap routes that require authentication in AppRoutes.jsx
 * 
 * @returns {JSX.Element} Either the protected content (Outlet) or redirect to login
 */
export default function ProtectedRoute() {
  const { user } = useAuth();

  // If there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, show the protected content
  return <Outlet />;
}