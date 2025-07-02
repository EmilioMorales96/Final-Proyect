import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import { MainLayout } from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import FormsDashboard from "./pages/FormsDashboard";
import FormsPage from "./pages/FormsPage";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppSettingsProvider } from "./context/AppSettingsContext.jsx";
import "./index.css";
import "./App.css";
import Welcome from "./pages/Welcome";
import { Toaster } from "react-hot-toast";
import TemplateEditor from "./pages/TemplateEditor.jsx";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppSettingsProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </AppSettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);