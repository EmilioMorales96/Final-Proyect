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
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminFormsPage from "./pages/admin/AdminFormsPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import TemplateAnswersPage from "./pages/TemplateAnswersPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forms" element={<FormsDashboard />} />
        <Route path="/forms/new" element={<TemplateEditor />} />
        <Route path="/forms/edit/:id" element={<TemplateEditor />} />
        <Route path="/forms/:id" element={<FormsPage />} />
        <Route path="/forms/:id/fill" element={<FormsPage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/templates/:id/answers" element={<TemplateAnswersPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/forms" element={<AdminFormsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}