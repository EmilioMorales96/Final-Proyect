import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiClipboard, FiTrash2 } from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";
import { useTemplatesData } from "../hooks/useTemplatesData.js";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Modal } from "../components/Modal";
import LikeButton from "../components/LikeButton";
import CommentModal from "../components/CommentModal";
import { FaRegCommentDots } from "react-icons/fa";
import TagCloud from "../components/TagCloud";
import MarkdownRenderer from "../components/MarkdownRenderer";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function FormsDashboard() {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const { templates, loading, fetchTemplates } = useTemplatesData(token);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentTemplateId, setCommentTemplateId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [tagFilter, setTagFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    if (!token) {
      setFavorites([]);
      return;
    }
    fetch(`${API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFavorites(Array.isArray(data) ? data : []);
      })
      .catch(() => setFavorites([]));
  }, [token]);

  // Open the modal and store the template id to delete
  const openDeleteModal = (id) => {
    setTemplateToDelete(id);
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setTemplateToDelete(null);
  };

  // Delete the selected template
  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      const res = await fetch(`${API_URL}/api/templates/${templateToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error();
      toast.success(t('msg.template_deleted'));
      fetchTemplates();
    } catch {
      toast.error(t('msg.failed_delete'));
    } finally {
      closeModal();
    }
  };

  // Fetch comment counts para todos los templates
  useEffect(() => {
    if (!Array.isArray(templates) || templates.length === 0) return;
    Promise.all(
      templates.map(t =>
        fetch(`${API_URL}/api/comments/template/${t.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
          .then(res => res.json())
          .then(data => [t.id, Array.isArray(data) ? data.length : 0])
          .catch(() => [t.id, 0])
      )
    ).then(results => {
      const counts = {};
      results.forEach(([id, count]) => { counts[id] = count; });
      setCommentCounts(counts);
    });
  }, [templates, token]);

  const updateCommentCount = (templateId, newCount) => {
    setCommentCounts(prev => ({ ...prev, [templateId]: newCount }));
  };

  const toggleFavorite = async (templateId) => {
    if (!token) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      const method = favorites.includes(templateId) ? "DELETE" : "POST";
      const res = await fetch(`${API_URL}/api/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ templateId }),
      });

      if (!res.ok) throw new Error();

      if (method === "POST") {
        setFavorites(prev => [...prev, templateId]);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FFD700', '#FFA500', '#FF6347'],
        });
        toast.success("Added to favorites!");
      } else {
        setFavorites(prev => prev.filter(id => id !== templateId));
        toast.success("Removed from favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const displayedTemplates = useMemo(() => {
    if (!Array.isArray(templates)) return [];
    return templates.filter(template => {
      const matchesTag = !tagFilter || (template.tags && template.tags.some(tag => tag.name === tagFilter));
      const matchesFavorites = !showOnlyFavorites || favorites.includes(template.id);
      return matchesTag && matchesFavorites;
    });
  }, [templates, favorites, tagFilter, showOnlyFavorites]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('dashboard.title')}
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                {t('dashboard.subtitle')}
              </p>
            </div>
            
            {/* Stats Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {Array.isArray(templates) ? templates.length : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.stats.total')}</div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl mb-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.stats.favorites')}</div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {Array.isArray(templates) ? templates.filter(t => 
                      (t.likes?.length || 0) >= 5 || Object.values(commentCounts)[t.id] >= 3
                    ).length : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.stats.trending')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {t('dashboard.my_templates')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.manage_organize')}
            </p>
          </div>
          {user && (
            <Link
              to="/forms/new"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <FiPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
              {t('dashboard.create_template')}
            </Link>
          )}
        </div>

        {/* Templates Gallery */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedTemplates.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-32 h-32 mb-8">
                <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                {tagFilter ? t('dashboard.no_templates_tag') : t('dashboard.no_templates')}
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
                {tagFilter 
                  ? t('dashboard.no_templates_tag_desc')
                  : t('dashboard.no_templates_desc')}
              </p>
              {user && (
                <Link
                  to="/forms/new"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <FiPlus className="text-xl" />
                  {t('dashboard.create_first')}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Template Header */}
                  <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {template.isPublic ? "Public" : "Private"}
                        </span>
                        {/* Trending Badge */}
                        {((template.likes?.length || 0) >= 5 || (commentCounts[template.id] || 0) >= 3) && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-400/90 backdrop-blur-sm rounded-full text-yellow-900 text-xs font-bold animate-pulse">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Trending
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">
                        {template.title}
                      </h3>
                    </div>
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                      {/* Copy Link */}
                      <button
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        title="Copy link"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/forms/${template.id}`);
                          toast.success("Link copied!");
                        }}
                      >
                        <FiClipboard className="text-white text-sm" />
                      </button>
                      
                      {/* Favorite Button */}
                      <button
                        className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                          favorites.includes(template.id) 
                            ? "bg-yellow-400/90 text-yellow-900" 
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                        title={favorites.includes(template.id) ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => toggleFavorite(template.id)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Template Content */}
                  <div className="p-6">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed prose-sm">
                      <MarkdownRenderer 
                        content={template.description} 
                        className="text-sm" 
                      />
                    </div>
                    
                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {/* Likes */}
                        <div className="flex items-center gap-1">
                          <LikeButton
                            templateId={template.id}
                            updateLikeCount={() => fetchTemplates()}
                          />
                          <span>{template.likes?.length || 0}</span>
                        </div>
                        
                        {/* Comments */}
                        <button
                          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          onClick={() => {
                            setCommentTemplateId(template.id);
                            setCommentModalOpen(true);
                          }}
                        >
                          <FaRegCommentDots />
                          <span>{commentCounts[template.id] || 0}</span>
                        </button>
                        
                        {/* Favorites */}
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          <span>{template.FavoredBy?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      {user ? (
                        <>
                          {/* Fill button - available for all users */}
                          <Link
                            to={`/forms/${template.id}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <FiClipboard className="text-sm" />
                            {t('template.fill_form')}
                          </Link>

                          {/* Edit, View Answers, and Delete buttons - only for template owner or admin */}
                          {(user.role === "admin" || user.id === template.authorId) && (
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                to={`/forms/edit/${template.id}`}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                                title={t('template.edit')}
                              >
                                <FiEdit2 className="text-sm" />
                                {t('template.edit')}
                              </Link>
                              <Link
                                to={`/templates/${template.id}/answers`}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                                title={t('template.answers')}
                              >
                                <FiClipboard className="text-sm" />
                                {t('template.answers')}
                              </Link>
                              <button
                                className="col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                title={t('template.delete')}
                                onClick={() => openDeleteModal(template.id)}
                              >
                                <FiTrash2 className="text-sm" />
                                {t('template.delete')}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                          {t('msg.login_to_interact')}
                        </div>
                      )}
                    </div>
                    
                    {/* Author Info */}
                    {template.author && (
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Created by {template.author.username}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              showOnlyFavorites 
                ? "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setShowOnlyFavorites(fav => !fav)}
          >
            {showOnlyFavorites ? "Show All Templates" : "Show Only Favorites"}
          </button>
          
          {tagFilter && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">
                Filtering by: #{tagFilter}
              </span>
              <button
                className="ml-2 p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded transition-colors"
                onClick={() => setTagFilter(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={modalOpen} title="Delete Template" onClose={closeModal}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Delete Template
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this template? All associated data including responses, comments, and likes will be permanently removed.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              onClick={handleDelete}
            >
              Delete Template
            </button>
          </div>
        </div>
      </Modal>

      <CommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        templateId={commentTemplateId}
        user={user}
        updateCommentCount={updateCommentCount}
      />

      <TagCloud onTagClick={setTagFilter} />
    </div>
  );
}
