import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserAnswersPage() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/forms/mine`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAnswers(data))
      .catch(() => toast.error("Could not load your answers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My answers</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : answers.length === 0 ? (
        <div className="text-center text-gray-500">You haven't answered any forms yet.</div>
      ) : (
        <div className="space-y-6">
          {answers.map((form) => (
            <div key={form.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="mb-2 text-sm text-gray-500">
                Answered on {new Date(form.createdAt).toLocaleString()}
              </div>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto">
                {JSON.stringify(form.answers, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}