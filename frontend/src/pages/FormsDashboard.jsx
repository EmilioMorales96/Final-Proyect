import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiClipboard, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTemplatesData } from "../hooks/useTemplatesData.js";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Modal } from "../components/Modal";
import LikeButton from "../components/LikeButton";
import CommentModal from "../components/CommentModal";
import { FaRegCommentDots } from "react-icons/fa";
import TagCloud from "../components/TagCloud";
import confetti from "canvas-confetti";

const API_URL = import.meta.env.VITE_API_URL;

function tagColor(name) {
  const colors = ["from-pink-200", "from-blue-200", "from-green-200", "from-yellow-100", "from-purple-200"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function FormsDashboard() {
  const { token, user } = useAuth();
  const { templates, loading, fetchTemplates } = useTemplatesData(token);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentTemplateId, setCommentTemplateId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [tagFilter, setTagFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favAnimation, setFavAnimation] = useState({});
  const navigate = useNavigate();

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
      toast.success("Template deleted");
      fetchTemplates();
    } catch {
      toast.error("Failed to delete template");
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

  // Actualiza el contador de comentarios para un template
  const updateCommentCount = (templateId, delta) => {
    setCommentCounts(prev => ({
      ...prev,
      [templateId]: Math.max(0, (prev[templateId] || 0) + delta)
    }));
  };

  // Siempre asegura que templates es un array
  const safeTemplates = Array.isArray(templates) ? templates : [];
  const filteredTemplates = tagFilter
    ? safeTemplates.filter(t => Array.isArray(t.Tags) && t.Tags.some(tag => tag.name === tagFilter))
    : safeTemplates;

  const displayedTemplates = showOnlyFavorites
    ? filteredTemplates.filter(t => favorites.includes(t.id))
    : filteredTemplates;

  // Encuentra el template con más respuestas
  const mostAnsweredId = Object.keys(commentCounts).reduce((a, b) => commentCounts[a] > commentCounts[b] ? a : b, null);

  const toggleFavorite = async (templateId) => {
    if (!token) return;
    const isFav = favorites.includes(templateId);
    const method = isFav ? "DELETE" : "POST";
    const url = `${API_URL}/api/favorites/${templateId}`;
    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    });
    setFavorites(prev =>
      isFav ? prev.filter(id => id !== templateId) : [...prev, templateId]
    );
    setFavAnimation(anim => ({ ...anim, [templateId]: true }));
    setTimeout(() => setFavAnimation(anim => ({ ...anim, [templateId]: false })), 700);

    if (!isFav) confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  // Log de depuración
  console.log("FormsDashboard render", {
    templates,
    safeTemplates,
    filteredTemplates,
    displayedTemplates,
    loading,
    favorites,
    tagFilter,
    showOnlyFavorites,
    commentCounts,
    user,
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Forms
          </h1>
          {user && (
            <Link
              to="/forms/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold shadow hover:from-purple-800 hover:to-indigo-900 transition-all text-lg"
            >
              <FiPlus className="text-xl" />
              Create form
            </Link>
          )}
        </div>

        {/* Forms gallery */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Recent forms
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : displayedTemplates.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-16 flex flex-col items-center gap-6">
              <span>No templates found for this tag.</span>
              {user ? (
                <Link
                  to="/forms/new"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold shadow hover:from-purple-800 hover:to-indigo-900 transition-all text-lg"
                >
                  Create a new template
                </Link>
              ) : (
                <button
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-semibold shadow hover:from-purple-800 hover:to-indigo-900 transition-all text-lg"
                  onClick={() => navigate("/login")}
                >
                  Start creating
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col h-full p-0 overflow-hidden ${template.id === mostAnsweredId ? "ring-4 ring-indigo-400 animate-pulse" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)`,
                    backgroundPosition: `${template.id * 13 % 100}% ${template.id * 29 % 100}%`
                  }}
                >
                  <div className="flex-1 flex flex-col gap-2 p-6 pb-4">
                    <h3 className="font-bold text-2xl text-purple-700 dark:text-purple-400 mb-1 truncate">
                      {template.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-base mb-1 line-clamp-2">
                      {template.description}
                    </p>
                    {/* Tags */}
                    {Array.isArray(template.Tags) && template.Tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {template.Tags.map(tag => (
                          <button
                            key={tag.id}
                            onClick={() => setTagFilter(tag.name)}
                            className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${tagColor(tag.name)} to-white dark:from-purple-900 dark:via-indigo-800 dark:to-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold border border-purple-200 dark:border-purple-700 transition`}
                            style={{ cursor: "pointer" }}
                            title={`Show templates with #${tag.name} (${tag.count || ""} uses)`}
                            type="button"
                          >
                            #{tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Updated: {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2 min-w-0">
                    {user ? (
                      <>
                        <Link
                          to={`/forms/${template.id}/edit`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Edit"
                        >
                          <FiEdit2 />
                          Edit
                        </Link>
                        <Link
                          to={`/forms/${template.id}/fill`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Fill"
                        >
                          <FiClipboard />
                          Fill
                        </Link>
                        <Link
                          to={`/forms/${template.id}/answers`}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition w-full sm:w-auto"
                          title="View answers"
                        >
                          <FiClipboard />
                          View answers
                        </Link>
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition w-full sm:w-auto"
                          title="Delete"
                          onClick={() => openDeleteModal(template.id)}
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-2">
                        Log in to edit, fill, or delete forms.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <LikeButton templateId={template.id} />
                    <button
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
                      onClick={() => { setCommentTemplateId(template.id); setCommentModalOpen(true); }}
                      title="View comments"
                      type="button"
                    >
                      <FaRegCommentDots size={20} />
                      <span className="font-semibold">{commentCounts[template.id] || 0}</span>
                    </button>
                  </div>
                  {template.isTrending && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
                      🔥 Trending
                    </span>
                  )}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 z-10">
                    {/* Copy link */}
                    <button
                      className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow hover:bg-purple-100 dark:hover:bg-purple-800 transition"
                      title="Copy link"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/forms/${template.id}`);
                        toast.success("Link copied!");
                      }}
                      type="button"
                    >
                      <FiClipboard className="text-purple-700 dark:text-purple-300" />
                    </button>
                    {/* Mark as favorite */}
                    <button
                      className={`p-2 rounded-full bg-white border shadow hover:bg-yellow-100 transition ${favorites.includes(template.id) ? "ring-2 ring-yellow-400" : ""}`}
                      title={favorites.includes(template.id) ? "Remove from favorites" : "Mark as favorite"}
                      onClick={() => toggleFavorite(template.id)}
                      type="button"
                    >
                      <span role="img" aria-label="star" className={`text-yellow-500 ${favorites.includes(template.id) ? "font-bold scale-125" : ""}`}>⭐</span>
                    </button>
                    {/* Share */}
                    <button
                      className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow hover:bg-blue-100 dark:hover:bg-blue-800 transition"
                      title="Share"
                      onClick={() => {
                        const url = `${window.location.origin}/forms/${template.id}`;
                        if (navigator.share) {
                          navigator.share({
                            title: template.title,
                            text: "Check out this form!",
                            url,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(url);
                          toast.success("Link copied!");
                        }
                      }}
                      type="button"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-blue-500">
                        <path d="M15 5l7 7-7 7M22 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <img src={template.author?.avatar || "/avatar.png"} alt="" className="w-7 h-7 rounded-full border-2 border-white shadow" />
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{template.author?.username}</span>
                  </div>
                  <span
                    className={`ml-1 text-yellow-600 font-bold text-sm transition-transform duration-300 inline-block
    ${favAnimation[template.id] ? "animate-pop-fav drop-shadow-lg" : ""}`}
                  >
                    {Array.isArray(template.FavoredBy) ? template.FavoredBy.length : 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="mb-4 px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold"
          onClick={() => setShowOnlyFavorites(fav => !fav)}
        >
          {showOnlyFavorites ? "Show All" : "Show Only Favorites"}
        </button>
      </div>
      <Modal open={modalOpen} title="Delete template" onClose={closeModal}>
        <p className="mb-6 text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this template? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={handleDelete}
          >
            Delete
          </button>
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
      {tagFilter && (
        <div className="mb-4">
          <span className="text-indigo-700 font-semibold">
            Filtering by tag: #{tagFilter}
          </span>
          <button
            className="ml-2 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setTagFilter(null)}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}