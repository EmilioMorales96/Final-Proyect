import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/api/forms/admin/all").then(setForms);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Forms Management</h2>
        <Link
          to="/admin"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
        >
          ← Back to Admin Panel
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {forms.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400 font-semibold">
                  No forms found.
                </td>
              </tr>
            ) : (
              forms.map((form) => (
                <tr key={form.id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{form.title}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={form.author?.avatar || "/avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-indigo-200 shadow"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{form.author?.username}</div>
                      <div className="text-xs text-gray-500">{form.author?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    <Link
                      to={`/forms/${form.id}/edit`}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/forms/${form.id}/fill`}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow transition"
                    >
                      Answer
                    </Link>
                    <Link
                      to={`/forms/${form.id}/answers`}
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition"
                    >
                      See Answers
                    </Link>
                    <button
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
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
  );
}