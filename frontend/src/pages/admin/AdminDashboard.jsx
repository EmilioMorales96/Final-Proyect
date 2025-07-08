import { Link } from "react-router-dom";

/**
 * AdminDashboard - Main entry for admin users.
 * Lets admin choose between user management and form management.
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-16">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 drop-shadow">
          Admin Panel
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/admin/users"
            className="rounded-xl shadow-lg bg-gradient-to-br from-indigo-100 to-white hover:from-indigo-200 hover:to-indigo-50 p-8 flex flex-col items-center transition group border border-indigo-100 hover:border-indigo-300"
          >
            <span className="text-6xl mb-4 transition-transform group-hover:scale-110">
              👤
            </span>
            <span className="text-2xl font-semibold mb-2 text-indigo-800">
              User Management
            </span>
            <span className="text-gray-500 text-center">
              Block, delete, promote and manage users.
            </span>
          </Link>
          <Link
            to="/admin/forms"
            className="rounded-xl shadow-lg bg-gradient-to-br from-indigo-100 to-white hover:from-indigo-200 hover:to-indigo-50 p-8 flex flex-col items-center transition group border border-indigo-100 hover:border-indigo-300"
          >
            <span className="text-6xl mb-4 transition-transform group-hover:scale-110">
              📝
            </span>
            <span className="text-2xl font-semibold mb-2 text-indigo-800">
              Forms Management
            </span>
            <span className="text-gray-500 text-center">
              Edit, delete, answer and view forms from all users.
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}