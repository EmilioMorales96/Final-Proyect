import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiChevronRight } from 'react-icons/fi';

/**
 * LanguageMenuOption - Language selector integrated into user menu
 * Provides language switching functionality within the user dropdown menu
 * 
 * Features:
 * - Expandable submenu for language selection
 * - Current language indicator with flag
 * - Smooth transitions and animations
 * - Consistent styling with user menu
 * 
 * @param {Function} onLanguageChange - Callback when language is changed
 * @returns {JSX.Element} Language menu option component
 */
export default function LanguageMenuOption({ onLanguageChange }) {
  const { i18n, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsExpanded(false);
    onLanguageChange?.(languageCode);
  };

  return (
    <div className="relative">
      {/* Main language option */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-5 py-2 text-gray-800 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FiGlobe className="text-purple-700 dark:text-purple-300" />
          <span>{t('layout.language', 'Language')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{currentLanguage.name}</span>
          <FiChevronRight 
            className={`text-sm text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`} 
          />
        </div>
      </button>

      {/* Expanded language options */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center gap-3 px-8 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentLanguage.code === language.code 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.nativeName}</span>
                {currentLanguage.code === language.code && (
                  <span className="text-xs opacity-75">{t('layout.current', 'Current')}</span>
                )}
              </div>
              {currentLanguage.code === language.code && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
