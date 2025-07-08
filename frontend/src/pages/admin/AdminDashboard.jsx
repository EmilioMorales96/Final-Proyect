import { Link } from "react-router-dom";

/**
 * AdminDashboard - Main entry for admin users.
 * Lets admin choose between user management and form management.
 */
export default function AdminDashboard() {
  return (
    <div className="max-w-2xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/admin/users"
          className="rounded-xl shadow-lg bg-white hover:bg-indigo-50 p-8 flex flex-col items-center transition"
        >
          <span className="text-5xl mb-4">👤</span>
          <span className="text-xl font-semibold mb-2">User Management</span>
          <span className="text-gray-500 text-center">
            Block, Delete, Promote and Administrate Users.
          </span>
        </Link>
        <Link
          to="/admin/forms"
          className="rounded-xl shadow-lg bg-white hover:bg-indigo-50 p-8 flex flex-col items-center transition"
        >
          <span className="text-5xl mb-4">📝</span>
          <span className="text-xl font-semibold mb-2">Manage Forms</span>
          <span className="text-gray-500 text-center">
            Edit, Delete, Answer and visualice forms.
          </span>
        </Link>
      </div>
    </div>
  );
}