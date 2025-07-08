import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/api/forms/admin/all").then(setForms);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Forms Management</h2>
          <Link
            to="/admin"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            ← Back to Admin Panel
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-50 dark:bg-indigo-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500 dark:text-gray-400 font-semibold">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">📝</span>
                      No forms found.
                    </div>
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{form.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={form.author?.avatar || "/avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-indigo-200 dark:border-indigo-600 shadow-md"
                      />
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{form.author?.username}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{form.author?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      <Link
                        to={`/forms/${form.id}/edit`}
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/forms/${form.id}/fill`}
                        className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Answer
                      </Link>
                      <Link
                        to={`/forms/${form.id}/answers`}
                        className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        View Answers
                      </Link>
                      <button
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        // onClick={handleDelete(form.id)}
                        title="Delete form"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}