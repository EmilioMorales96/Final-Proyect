import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/Layout.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import FormsDashboard from "./pages/FormsDashboard";
import FormsPage from "./pages/FormsPage";
import Welcome from "./pages/Welcome";
import TemplateEditor from "./pages/TemplateEditor.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function AppRoutes() {
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
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}