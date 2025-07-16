import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Modal que se muestra cuando un usuario ha sido bloqueado
 * Aparece automáticamente y redirige después de un tiempo
 */
export default function UserBlockedModal({ show, message, onClose }) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 mx-4 max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 5.636l12.728 12.728" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('userStatus.accountBlocked', 'Account Blocked')}
          </h2>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold text-sm">
              {t('userStatus.redirecting', 'Redirecting to login page in')} {countdown} {t('userStatus.seconds', 'seconds')}...
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('userStatus.loginNow', 'Go to Login Now')}
          </button>
        </div>
      </div>
    </div>
  );
}
