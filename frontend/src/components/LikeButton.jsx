import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

/**
 * LikeButton component for liking/unliking a template.
 * Shows like count and updates parent via updateLikeCount.
 */
export default function LikeButton({ templateId, updateLikeCount }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch like count and user like status on mount/template change
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/likes/template/${templateId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCount(data.count || 0);
        setLiked(data.liked || false);
      });
  }, [templateId]);

  // Handle like action
  const handleLike = async () => {
    if (!token) {
      toast.error("You must be logged in to like.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });
      if (res.ok) {
        setLiked(true);
        setCount(c => c + 1);
        if (updateLikeCount) updateLikeCount(templateId, +1);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error liking.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle unlike action
  const handleUnlike = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });
      if (res.ok) {
        setLiked(false);
        setCount(c => Math.max(0, c - 1));
        if (updateLikeCount) updateLikeCount(templateId, -1);
      } else {
        const data = await res.json();
        toast.error(data.message || "Error unliking.");
      }
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