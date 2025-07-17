import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiHelpCircle, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Support Ticket Component for Power Automate integration
 * Creates support tickets and uploads them to OneDrive/Dropbox
 */
export const SupportTicket = ({ isOpen, onClose, templateTitle = null }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    summary: '',
    priority: 'Average'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) {
      toast.error('Please provide a summary');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/support/test-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: formData.summary,
          priority: formData.priority,
          description: `Support ticket created from ${window.location.href}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('support.ticket_created'));
        onClose();
        // Reset form
        setFormData({
          summary: '',
          priority: 'Average'
        });
      } else {
        toast.error(data.message || 'Error creating support ticket');
      }
    } catch (error) {
      console.error('Support ticket error:', error);
      toast.error('Error creating support ticket');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiHelpCircle className="mr-2" />
              {t('support.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('support.summary')} *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('support.priority')}
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="High">{t('support.priority_high')}</option>
                <option value="Average">{t('support.priority_average')}</option>
                <option value="Low">{t('support.priority_low')}</option>
              </select>
            </div>

            {templateTitle && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Template:</strong> {templateTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Current Page:</strong> {location.pathname}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.summary.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <FiSend className="mr-2" />
                {loading ? 'Creating...' : t('support.create_ticket')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
