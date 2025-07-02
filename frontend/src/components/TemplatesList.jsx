import { EmptyState } from "./EmptyState.jsx";

export function TemplatesList({ templates, loading, onDelete, darkMode }) {
  const safeTemplates = Array.isArray(templates) ? templates : [];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }
  if (!safeTemplates.length) {
    return <EmptyState message="No templates available. Create one first." darkMode={darkMode} />;
  }
  return (
    <div className="space-y-4">
      {safeTemplates.map(template => (
        <div key={template.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 shadow">
          <h3 className="font-medium text-gray-800 dark:text-gray-100">{template.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => onDelete(template.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}