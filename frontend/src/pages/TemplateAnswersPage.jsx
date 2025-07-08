import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Function to display the answer in a user-friendly way according to the question type
function renderAnswer(question, answer) {
  if (answer === undefined || answer === null || answer === "") return <span className="italic text-gray-400">No answer</span>;
  
  if (question.type === "checkbox" && Array.isArray(answer)) {
    return answer.length ? answer.join(", ") : <span className="italic text-gray-400">No answer</span>;
  }
  if (["radio", "select", "text", "textarea"].includes(question.type)) {
    return answer;
  }
  if (["linear", "rating"].includes(question.type)) {
    return <span className="font-mono">{answer}</span>;
  }
  if (question.type === "grid_radio" && typeof answer === "object" && answer !== null) {
    return (
      <ul className="ml-2 list-disc">
        {Object.entries(answer).map(([row, val]) => (
          <li key={row}>
            <span className="font-semibold">{row}:</span> {val || <span className="italic text-gray-400">No answer</span>}
          </li>
        ))}
      </ul>
    );
  }
  if (question.type === "grid_checkbox" && typeof answer === "object" && answer !== null) {
    return (
      <ul className="ml-2 list-disc">
        {Object.entries(answer).map(([row, arr]) => (
          <li key={row}>
            <span className="font-semibold">{row}:</span>{" "}
            {Array.isArray(arr) && arr.length ? arr.join(", ") : <span className="italic text-gray-400">No answer</span>}
          </li>
        ))}
      </ul>
    );
  }
  if (question.type === "file") {
    return Array.isArray(answer)
      ? answer.map((file, i) => <div key={i}>{typeof file === "string" ? file : JSON.stringify(file)}</div>)
      : typeof answer === "string"
      ? answer
      : JSON.stringify(answer);
  }
  // Fallback for any other object
  if (typeof answer === "object") {
    return <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs">{JSON.stringify(answer, null, 2)}</pre>;
  }
  return String(answer);
}

export default function TemplateAnswersPage() {
  const { id } = useParams(); // template id
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    setLoading(true);
    setError(null);
    
    // Load template
    fetch(`${API_URL}/api/templates/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load template');
        return res.json();
      })
      .then(setTemplate)
      .catch((err) => {
        console.error('Template loading error:', err);
        setError('Could not load template');
        toast.error("Could not load template");
      });

    // Load answers
    fetch(`${API_URL}/api/forms/template/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load answers');
        return res.json();
      })
      .then(data => {
        console.log('Answers loaded:', data);
        setAnswers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Answers loading error:', err);
        setError('Could not load answers');
        toast.error("Could not load answers");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <span className="text-lg text-gray-600 dark:text-gray-400">Loading answers...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
        </div>
      </div>
    );

  if (!template)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg text-gray-600 dark:text-gray-400">Template not found</span>
        </div>
      </div>
    );

  // Button to clear filters
  const clearFilters = () => {
    setFilterUserId("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const filteredAnswers = answers.filter(form => {
    // User filter
    const userMatch = !filterUserId || (form.User && String(form.User.id) === filterUserId);

    // Date range filter
    const date = new Date(form.createdAt).toISOString().slice(0, 10);
    const fromOk = !filterDateFrom || date >= filterDateFrom;
    const toOk = !filterDateTo || date <= filterDateTo;

    return userMatch && fromOk && toOk;
  });

  const uniqueUsers = Array.from(
    new Map(
      answers
        .filter(f => f.User)
        .map(f => [f.User.id, { id: f.User.id, name: f.User.name, email: f.User.email }])
    ).values()
  );

  // (Removed dynamic text block for date filters because it's not used)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Answers for: {template.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{template.description}</p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Total responses: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{answers.length}</span>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative group">
              <svg className="inline w-4 h-4 mr-1 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
              </svg>
              <div className="absolute z-10 left-6 top-1 w-72 p-3 rounded bg-gray-900 text-gray-100 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
                You can filter answers by user and by a <b>date range</b> using the fields below.<br />
                Select a start date ("From") and an end date ("To") to see only the answers within that period.<br />
                {filterDateFrom && filterDateTo && (
                  <span>
                    <br />Currently filtering between <b>{filterDateFrom}</b> and <b>{filterDateTo}</b>.
                  </span>
                )}
                {filterDateFrom && !filterDateTo && (
                  <span>
                    <br />Currently showing answers from <b>{filterDateFrom}</b>.
                  </span>
                )}
                {!filterDateFrom && filterDateTo && (
                  <span>
                    <br />Currently showing answers up to <b>{filterDateTo}</b>.
                  </span>
                )}
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Advanced filters</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by user</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                value={filterUserId}
                onChange={e => setFilterUserId(e.target.value)}
              >
                <option value="">All users</option>
                {uniqueUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                value={filterDateFrom}
                onChange={e => setFilterDateFrom(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                value={filterDateTo}
                onChange={e => setFilterDateTo(e.target.value)}
              />
            </div>
            
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap"
            >
              Clear filters
            </button>
          </div>
          
          {filteredAnswers.length !== answers.length && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAnswers.length} of {answers.length} responses
            </div>
          )}
        </div>

        {filteredAnswers.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No answers match the filters.</div>
        ) : (
          <div className="space-y-8">
            {filteredAnswers.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span>
                    Answered on {new Date(form.createdAt).toLocaleString()}
                  </span>
                  {form.User && (
                    <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                      {form.User.name || form.User.email}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {template.questions.map((q) => (
                    <div key={q.id}>
                      <div className="font-semibold text-gray-700 dark:text-gray-200">{q.label}</div>
                      <div className="ml-2 text-gray-800 dark:text-gray-100">
                        {renderAnswer(q, form.answers[q.id])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
