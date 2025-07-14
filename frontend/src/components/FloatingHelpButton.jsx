import { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import SupportTicket from './SupportTicket';

/**
 * Floating Help Button Component
 * Provides access to support ticket creation from any page
 */
export const FloatingHelpButton = ({ templateTitle = null }) => {
  const [showTicket, setShowTicket] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowTicket(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-40 hover:scale-110"
        title="Create support ticket"
      >
        <FiHelpCircle size={24} />
      </button>

      <SupportTicket
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        templateTitle={templateTitle}
      />
    </>
  );
};

export default FloatingHelpButton;
