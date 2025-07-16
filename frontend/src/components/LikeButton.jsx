import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

/**
 * LikeButton - Interactive like/unlike button for templates
 * 
 * Displays a heart icon with like count and handles like/unlike operations.
 * Automatically syncs with the backend API and shows real-time updates.
 * 
 * Features:
 * - Real-time like count display
 * - Optimistic UI updates for better UX
 * - Authentication requirement with helpful messages
 * - Loading states and error handling
 * - Accessibility attributes
 * - Parent component notification via callback
 * 
 * @param {Object} props - Component props
 * @param {number} props.templateId - ID of the template to like/unlike
 * @param {Function} [props.updateLikeCount] - Optional callback to notify parent of like count changes
 * @returns {JSX.Element} Interactive like button with heart icon and count
 */
export default function LikeButton({ templateId, updateLikeCount }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch like count and user like status on mount/template change
  useEffect(() => {
    if (!templateId) return;
    
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/likes/template/${templateId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          setCount(data.count || 0);
          setLiked(data.liked || false);
        } else {
          // If unauthorized, just show count without user status
          console.warn('Unable to fetch like status, showing public count only');
          setLiked(false);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
        // Graceful fallback - don't break the UI
        setCount(0);
        setLiked(false);
      }
    };

    fetchLikeStatus();
  }, [templateId]);

  // Handle like action with optimistic updates and error recovery
  const handleLike = async () => {
    if (!token) {
      toast.error("You must be logged in to like templates.");
      return;
    }
    
    if (!templateId) {
      toast.error("Invalid template.");
      return;
    }
    
    // Optimistic update
    const originalCount = count;
    const originalLiked = liked;
    setLiked(true);
    setCount(c => c + 1);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });

      if (response.ok) {
        // Success - optimistic update was correct
        if (updateLikeCount) updateLikeCount(templateId, +1);
      } else {
        // Revert optimistic update
        setLiked(originalLiked);
        setCount(originalCount);
        
        const data = await response.json();
        toast.error(data.message || "Unable to like template. Please try again.");
      }
    } catch (error) {
      // Network/other error - revert optimistic update
      setLiked(originalLiked);
      setCount(originalCount);
      console.error('Error liking template:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle unlike action with optimistic updates and error recovery
  const handleUnlike = async () => {
    if (!token) {
      toast.error("You must be logged in to unlike templates.");
      return;
    }
    
    // Optimistic update
    const originalCount = count;
    const originalLiked = liked;
    setLiked(false);
    setCount(c => Math.max(0, c - 1));
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });

      if (response.ok) {
        // Success - optimistic update was correct
        if (updateLikeCount) updateLikeCount(templateId, -1);
      } else {
        // Revert optimistic update
        setLiked(originalLiked);
        setCount(originalCount);
        
        const data = await response.json();
        toast.error(data.message || "Unable to unlike template. Please try again.");
      }
    } catch (error) {
      // Network/other error - revert optimistic update
      setLiked(originalLiked);
      setCount(originalCount);
      console.error('Error unliking template:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={liked ? handleUnlike : handleLike}
      disabled={loading}
      className="flex items-center gap-1 text-pink-600 hover:text-pink-700 transition disabled:opacity-60"
      title={liked ? "Unlike" : "Like"}
      aria-label={liked ? "Unlike" : "Like"}
      type="button"
    >
      {liked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
      <span className="font-semibold">{count}</span>
    </button>
  );
}