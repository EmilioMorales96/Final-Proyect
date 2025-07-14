import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiKey, FiCopy, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * API Token Component for external integrations
 * Generates and manages API tokens for accessing user's form data
 */
export const ApiTokenManager = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/generate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.apiToken);
        toast.success(t('api.token_generated'));
      } else {
        toast.error(data.message || 'Error generating token');
      }
    } catch (error) {
      console.error('Token generation error:', error);
      toast.error('Error generating token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success(t('api.token_copied'));
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Failed to copy token');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
        <FiKey className="mr-2" />
        {t('api.token_title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {t('api.token_description')}
      </p>
      
      <div className="space-y-4">
        <button
          onClick={generateToken}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
        >
          <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : t('api.generate_token')}
        </button>

        {token && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                {token}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Copy token"
              >
                <FiCopy />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use this token for external API access to your template data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTokenManager;
