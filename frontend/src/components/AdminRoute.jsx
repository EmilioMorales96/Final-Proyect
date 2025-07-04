import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute({ user }) {
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return <Outlet />;
}