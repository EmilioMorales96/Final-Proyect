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
import { AuthProvider } from "./context/AuthContext.jsx"; // Importa useAuth
import { AppSettingsProvider } from "./context/AppSettingsContext.jsx";
import "./index.css";
import "./App.css";
import Welcome from "./pages/Welcome";
import { Toaster } from "react-hot-toast";
import TemplateEditor from "./pages/TemplateEditor.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AppRoutes from "./AppRoutes.jsx";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);


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