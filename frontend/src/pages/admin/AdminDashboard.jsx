import { Link } from "react-router-dom";

/**
 * AdminDashboard - Main entry for admin users.
 * Lets admin choose between user management and form management.
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-10 mx-4 border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 dark:text-indigo-300 drop-shadow">
            Admin Panel
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/admin/users"
              className="rounded-xl shadow-lg dark:shadow-gray-900/50 bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-gray-800 hover:from-indigo-200 hover:to-indigo-50 dark:hover:from-indigo-800 dark:hover:to-gray-700 p-8 flex flex-col items-center transition-all duration-300 group border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl dark:hover:shadow-gray-900/70"
            >
              <span className="text-6xl mb-4 transition-transform group-hover:scale-110 duration-300">
                👤
              </span>
              <span className="text-2xl font-semibold mb-2 text-indigo-800 dark:text-indigo-300">
                User Management
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-center">
                Block, delete, promote and manage users.
              </span>
            </Link>
            <Link
              to="/admin/forms"
              className="rounded-xl shadow-lg dark:shadow-gray-900/50 bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-gray-800 hover:from-indigo-200 hover:to-indigo-50 dark:hover:from-indigo-800 dark:hover:to-gray-700 p-8 flex flex-col items-center transition-all duration-300 group border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl dark:hover:shadow-gray-900/70"
            >
              <span className="text-6xl mb-4 transition-transform group-hover:scale-110 duration-300">
                📝
              </span>
              <span className="text-2xl font-semibold mb-2 text-indigo-800 dark:text-indigo-300">
                Forms Management
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-center">
                Edit, delete, answer and view forms from all users.
              </span>
            </Link>
            <Link
              to="/admin/integrations"
              className="rounded-xl shadow-lg dark:shadow-gray-900/50 bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-gray-800 hover:from-indigo-200 hover:to-indigo-50 dark:hover:from-indigo-800 dark:hover:to-gray-700 p-8 flex flex-col items-center transition-all duration-300 group border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl dark:hover:shadow-gray-900/70"
            >
              <span className="text-6xl mb-4 transition-transform group-hover:scale-110 duration-300">
                🔗
              </span>
              <span className="text-2xl font-semibold mb-2 text-indigo-800 dark:text-indigo-300">
                System Integrations
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-center">
                Manage Salesforce integration and API tokens.
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}