import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TagCloud from "../components/TagCloud";
import MarkdownRenderer from "../components/MarkdownRenderer";
import FloatingHelpButton from "../components/FloatingHelpButton";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const { t } = useTranslation();
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent templates
      const recentResponse = await fetch(`${API_URL}/api/templates/recent`);
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        // Ensure we always set an array
        setRecentTemplates(Array.isArray(recentData) ? recentData : []);
      } else {
        console.error("Failed to fetch recent templates:", recentResponse.status);
        setRecentTemplates([]);
      }

      // Fetch popular templates
      const popularResponse = await fetch(`${API_URL}/api/templates/popular`);
      if (popularResponse.ok) {
        const popularData = await popularResponse.json();
        // Ensure we always set an array
        setPopularTemplates(Array.isArray(popularData) ? popularData : []);
      } else {
        console.error("Failed to fetch popular templates:", popularResponse.status);
        setPopularTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      // Set empty arrays on error
      setRecentTemplates([]);
      setPopularTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 home-animated-bg" />
      <div className="relative z-10 min-h-screen font-sans">
        
        {/* Hero Section */}
        <div className="flex min-h-screen items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-10 w-full max-w-4xl text-center backdrop-blur-md animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-8 leading-tight text-purple-700 dark:text-purple-400">
              Welcome to <span className="block">FormsApp</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-200 text-xl mb-10 leading-relaxed">
              The perfect platform to create and manage
              <br />
              online forms easily and efficiently.
            </p>
            <div className="flex justify-center mb-12">
              <Link
                to="/forms"
                className="px-10 py-4 rounded-lg font-semibold bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md hover:from-purple-800 hover:to-indigo-900 transition-all duration-200 text-lg"
              >
                Go to Forms
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Templates Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Templates
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the latest form templates created by our community
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recentTemplates || []).slice(0, 6).map((template) => (
                  <Link
                    key={template.id}
                    to={`/forms/${template.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {template.title}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      <MarkdownRenderer 
                        content={template.description} 
                        className="text-sm prose-sm max-w-none" 
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span>by {template.author?.username}</span>
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {template.topic}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Templates Section */}
        <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Top 5 Popular Templates
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most liked and commented templates from our community
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(popularTemplates || []).slice(0, 5).map((template, index) => (
                  <Link
                    key={template.id}
                    to={`/forms/${template.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700 relative"
                  >
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {template.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>❤️ {template.likes?.length || 0}</span>
                      <span>💬 {template.commentsCount || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tag Cloud Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Tags
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore templates by popular tags
              </p>
            </div>
            <div className="flex justify-center">
              <TagCloud onTagClick={(tag) => window.location.href = `/forms?tag=${tag}`} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
}