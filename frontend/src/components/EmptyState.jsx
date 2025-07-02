export const EmptyState = ({ message, darkMode }) => (
  <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {message}
  </div>
);