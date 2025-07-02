import Button from './Button';

export const FormsList = ({ forms, loading, onDelete }) => {
  // Protection: always use array
  const safeForms = Array.isArray(forms) ? forms : [];
  if (!Array.isArray(forms)) {
    console.warn('[FormsList] forms is not an array:', forms);
  }

  if (loading) return <div>Loading...</div>;
  if (!safeForms.length) return <div>No forms found.</div>;

  return (
    <div className="space-y-4">
      {safeForms.map(form => (
        <div 
          key={form.id} 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">{form.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {form.description}
              </p>
            </div>
            <button
              onClick={() => onDelete(form.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              aria-label="Delete form"
            >
              Delete
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Created: {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      ))}
    </div>
  );
};