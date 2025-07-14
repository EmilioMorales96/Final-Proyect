import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * CommentModal component for viewing, adding, editing, and deleting comments.
 * Updates comment count in parent via updateCommentCount.
 */
export default function CommentModal({ open, onClose, templateId, user, updateCommentCount }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch all comments for the template
  const fetchComments = () => {
    if (!user || !user.token) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/api/comments/template/${templateId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  // Refetch comments when modal opens or template changes
  useEffect(() => {
    if (open) {
      fetchComments();
      
      // Set up auto-refresh every 3 seconds when modal is open
      const interval = setInterval(() => {
        fetchComments();
      }, 3000);
      
      // Cleanup interval when modal closes
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [open, templateId, user]);

  // Add a new comment
  const handleAdd = async () => {
    if (!content.trim() || !user || !user.token) return;
    setPosting(true);
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ templateId, content })
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(c => [...c, newComment]);
        setContent("");
        toast.success("Comment added!");
        if (updateCommentCount) updateCommentCount(templateId, +1);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error adding comment");
      }
    } finally {
      setPosting(false);
    }
  };

  // Start editing a comment
  const startEdit = (id, currentContent) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  // Save edited comment
  const handleEdit = async (id) => {
    if (!editContent.trim() || !user || !user.token) return;
    try {
      const res = await fetch(`${API_URL}/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ content: editContent })
      });
      if (res.ok) {
        setComments(comments.map(c => c.id === id ? { ...c, content: editContent } : c));
        setEditingId(null);
        toast.success("Comment updated!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Error updating comment");
      }
    } catch {
      toast.error("Error updating comment");
    }
  };

  // Delete a comment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?") || !user || !user.token) return;
    try {
      const res = await fetch(`${API_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== id));
        toast.success("Comment deleted!");
        if (updateCommentCount) updateCommentCount(templateId, -1);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error deleting comment");
      }
    } catch {
      toast.error("Error deleting comment");
    }
  };

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${open ? "" : "hidden"}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close modal button */}
        <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Comments</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-refreshing</span>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : !user ? (
          <div className="text-gray-400 text-sm mt-2">Log in to view and add comments.</div>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
            {safeComments.length === 0 && <div className="text-gray-400">No comments yet.</div>}
            {safeComments.map(c => (
              <div key={c.id} className="border-b pb-2 group relative">
                <div className="flex items-center gap-2 mb-1">
                  <img src={c.User?.avatar || "/avatar.png"} alt="" className="w-6 h-6 rounded-full" />
                  <span className="font-semibold">{c.User?.username || "User"}</span>
                  <span className="text-xs text-gray-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                  {(user && (user.id === c.userId || user.role === "admin")) && (
                    <span className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100 transition">
                      {editingId === c.id ? (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleEdit(c.id)}
                            title="Save"
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                          >
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={() => startEdit(c.id, c.content)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(c.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </span>
                  )}
                </div>
                {editingId === c.id ? (
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleEdit(c.id); }}
                    autoFocus
                  />
                ) : (
                  <div className="text-gray-800 dark:text-gray-100">{c.content}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {user ? (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Add a comment..."
              disabled={posting}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={posting || !content.trim()}
            >
              {posting ? "Posting..." : "Send"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}