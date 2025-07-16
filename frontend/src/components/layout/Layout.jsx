import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import UserMenu from '../UserMenu'; 
import FloatingHelpButton from '../FloatingHelpButton';

/**
 * Main layout component that provides the application structure
 * Includes navigation bar, search functionality, main content area, and footer
 * 
 * Features:
 * - Responsive navigation with brand link and forms navigation
 * - Global search functionality with dropdown results
 * - User authentication state handling (login/register vs user menu)
 * - Language selector integration
 * - Dark mode support
 * - Floating help button
 * 
 * @returns {JSX.Element} The main layout structure
 */
export const MainLayout = () => {
  const parsedUser = JSON.parse(localStorage.getItem("user"));
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  /**
   * Handles search functionality with API integration
   * @param {string} query - Search query string
   */
  const handleSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`, {
        headers: parsedUser ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}
      });
      
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  /**
   * Clears search state and results
   */
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="font-bold text-xl text-white no-underline font-sans"
            >
              FormsApp
            </Link>
            {parsedUser && (
              <Link 
                to="/forms" 
                className="text-white no-underline font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {t('nav.forms')}
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mx-4 flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('nav.search.placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    to={result.type === 'template' ? `/forms/${result.id}` : '#'}
                    onClick={clearSearch}
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {result.type} • {result.description || result.content}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {t('search.no_results')} "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!parsedUser ? (
              <>
                <Link 
                  to="/login" 
                  className="text-white no-underline px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="text-white no-underline px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </>
            ) : (
              <UserMenu user={parsedUser} />
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="max-w-3xl w-full px-2 py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full">
        <div className="py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-center text-white font-medium">
          © 2025 FormsApp - {t('footer.rights')}
        </div>
      </footer>

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};