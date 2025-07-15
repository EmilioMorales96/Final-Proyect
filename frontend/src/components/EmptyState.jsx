/**
 * Empty state component for displaying when no content is available
 * Shows a centered message with theme-aware styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display in empty state
 * @param {boolean} props.darkMode - Whether dark mode is active
 * @returns {JSX.Element} Centered empty state message
 */
export const EmptyState = ({ message, darkMode }) => (
  <div className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {message}
  </div>
);