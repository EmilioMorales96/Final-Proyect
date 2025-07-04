import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { user } = useAuth();
  const [showDenied, setShowDenied] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setShowDenied(true);
      const timer = setTimeout(() => setShowDenied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return showDenied ? (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-3xl font-bold text-red-600 mb-2">
          Acceso denegado
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-4">
          No tienes permisos para acceder a esta sección.
        </div>
      </div>
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <Outlet />;
}