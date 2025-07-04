import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/Layout.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import FormsDashboard from "./pages/FormsDashboard";
import FormsPage from "./pages/FormsPage";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; // Importa useAuth
import { AppSettingsProvider } from "./context/AppSettingsContext.jsx";
import "./index.css";
import "./App.css";
import Welcome from "./pages/Welcome";
import { Toaster } from "react-hot-toast";
import TemplateEditor from "./pages/TemplateEditor.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminRoute from "../components/AdminRoute";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);


function AppRoutes() {
  const { user } = useAuth(); // Obtén el usuario autenticado

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forms" element={<FormsDashboard />} />
        <Route path="/forms/new" element={<FormsPage />} />
        <Route path="/forms/:id/edit" element={<FormsPage />} />
        <Route path="/forms/:id/fill" element={<FormsPage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/templates/new" element={<TemplateEditor />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AdminRoute user={user} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppSettingsProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <AppRoutes />
        </BrowserRouter>
      </AppSettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);