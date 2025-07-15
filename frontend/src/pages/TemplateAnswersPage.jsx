import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Function to display the answer in a user-friendly way according to the question type
function renderAnswer(question, answer) {
  if (answer === undefined || answer === null || answer === "") {
    return (
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
        </svg>
        No answer provided
      </div>
    );
  }
  
  if (question.type === "checkbox" && Array.isArray(answer)) {
    if (!answer.length) {
      return (
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 italic">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
          No selections made
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-2">
        {answer.map((item, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {item}
          </span>
        ))}
      </div>
    );
  }
  
  if (["radio", "select"].includes(question.type)) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-gray-800 dark:text-gray-200 font-medium">{answer}</span>
      </div>
    );
  }
  
  if (["text", "textarea"].includes(question.type)) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
      </div>
    );
  }
  
  if (["linear", "rating"].includes(question.type)) {
    const rating = parseInt(answer);
    const maxRating = question.type === "linear" ? 10 : 5;
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(maxRating)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < rating 
                  ? 'bg-yellow-400' 
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {answer}/{maxRating}
        </span>
      </div>
    );
  }
  
  if (question.type === "grid_radio" && typeof answer === "object" && answer !== null) {
    return (
      <div className="space-y-3">
        {Object.entries(answer).map(([row, val]) => (
          <div key={row} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{row}</span>
            {val ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {val}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic text-sm">No answer</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  if (question.type === "grid_checkbox" && typeof answer === "object" && answer !== null) {
    return (
      <div className="space-y-3">
        {Object.entries(answer).map(([row, arr]) => (
          <div key={row} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{row}</div>
            {Array.isArray(arr) && arr.length ? (
              <div className="flex flex-wrap gap-1">
                {arr.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic text-sm">No selections</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  if (question.type === "file") {
    const files = Array.isArray(answer) ? answer : (answer ? [answer] : []);
    return (
      <div className="space-y-2">
        {files.map((file, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-blue-800 dark:text-blue-200 font-medium text-sm">
              {typeof file === "string" ? file : JSON.stringify(file)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  // Fallback for any other object
  if (typeof answer === "object") {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-x-auto">
        <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
          {JSON.stringify(answer, null, 2)}
        </pre>
      </div>
    );
  }
  
  return (
    <div className="text-gray-800 dark:text-gray-200 font-medium">
      {String(answer)}
    </div>
  );
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-2 border-indigo-300 dark:border-indigo-700 rounded-full border-b-transparent animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Loading Responses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Fetching template data and user responses...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-150"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-300"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-20 h-20 mb-6 text-red-500">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );

  if (!template)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-20 h-20 mb-6 text-gray-400">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Template Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested template could not be found or you don't have permission to view it.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Enhanced Design */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Template Responses
              </h1>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {template.title}
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                {template.description}
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{answers.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{uniqueUsers.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Filters Section with Modern Design */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg cursor-pointer transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-800/70">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute z-20 left-12 top-0 w-80 p-4 rounded-xl bg-gray-900 text-gray-100 text-sm shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                  <div className="font-semibold mb-2 text-indigo-300">Filter Options</div>
                  <p className="mb-3">Customize your view with powerful filtering options:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>User Filter:</strong> View responses from specific users</li>
                    <li>• <strong>Date Range:</strong> Filter by submission date</li>
                    <li>• <strong>Real-time Results:</strong> Filters update instantly</li>
                  </ul>
                  {(filterDateFrom || filterDateTo || filterUserId) && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-indigo-300 font-semibold mb-1">Active Filters:</div>
                      {filterUserId && <div className="text-xs">👤 User filter active</div>}
                      {filterDateFrom && <div className="text-xs">📅 From: {filterDateFrom}</div>}
                      {filterDateTo && <div className="text-xs">📅 To: {filterDateTo}</div>}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Advanced Filters</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Refine your results with precision</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Filter by User
                  </span>
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  value={filterUserId}
                  onChange={e => setFilterUserId(e.target.value)}
                >
                  <option value="">All users ({uniqueUsers.length} total)</option>
                  {uniqueUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    From Date
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  value={filterDateFrom}
                  onChange={e => setFilterDateFrom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    To Date
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  value={filterDateTo}
                  onChange={e => setFilterDateTo(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
            
            {filteredAnswers.length !== answers.length && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">
                    Filtered Results: Showing {filteredAnswers.length} of {answers.length} responses
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredAnswers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 mb-6">
              <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No responses found</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {answers.length === 0 
                ? "This template hasn't received any responses yet." 
                : "No responses match your current filter criteria."}
            </p>
            {filteredAnswers.length !== answers.length && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnswers.map((form, index) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Response Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submitted on {new Date(form.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    {form.User && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">
                          {form.User.name || form.User.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Content */}
                <div className="p-6">
                  <div className="grid gap-6">
                    {template.questions.map((q, qIndex) => (
                      <div key={q.id} className="group">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                            {qIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                              {q.label}
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-gray-800 dark:text-gray-100">
                                {renderAnswer(q, form.answers[q.id])}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
