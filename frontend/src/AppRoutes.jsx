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
import CreateTemplate from "./pages/CreateTemplate.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminFormsPage from "./pages/admin/AdminFormsPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import TemplateAnswersPage from "./pages/TemplateAnswersPage.jsx";

/**
 * Application routing configuration
 * Defines all application routes with their corresponding components
 * 
 * Route structure:
 * - Public routes: Home, Login, Register, Welcome
 * - Protected routes: Profile (requires authentication)
 * - Admin routes: Dashboard, Users, Forms (requires admin role)
 * - Forms routes: Dashboard, Create, Edit, View, Fill
 * - Template routes: Create, Edit, View answers
 * 
 * @returns {JSX.Element} Configured routes component
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Forms and templates routes */}
        <Route path="/forms" element={<FormsDashboard />} />
        <Route path="/forms/new" element={<CreateTemplate />} />
        <Route path="/templates/new" element={<CreateTemplate />} />
        <Route path="/forms/edit/:id" element={<TemplateEditor />} />
        <Route path="/templates/edit/:id" element={<TemplateEditor />} />
        <Route path="/forms/:id" element={<FormsPage />} />
        <Route path="/forms/:id/fill" element={<FormsPage />} />
        <Route path="/templates/:id/answers" element={<TemplateAnswersPage />} />
        
        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Admin routes - require admin role */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/forms" element={<AdminFormsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}