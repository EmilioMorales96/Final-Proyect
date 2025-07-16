import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * TagCloud - Interactive tag cloud component
 * Displays tags with font sizes proportional to their usage count
 * 
 * Features:
 * - Dynamic font sizing based on tag frequency
 * - Clickable tags for filtering
 * - Fetches tag data from API with error handling
 * - Loading state with skeleton animation
 * - Defensive programming against API failures
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onTagClick - Callback when a tag is clicked
 * @returns {JSX.Element} Visual tag cloud with clickable tags
 */
export default function TagCloud({ onTagClick }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/tags/cloud`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure we always set an array with proper validation
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tag cloud:', error);
      setError(error.message);
      setTags([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // Loading state with skeleton animation
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 py-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ width: `${60 + Math.random() * 80}px` }}
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Unable to load tags. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!tags.length) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No tags available yet.
        </p>
      </div>
    );
  }

  // Calculate font size based on tag count with safe fallbacks
  const minFont = 14, maxFont = 32;
  const tagCounts = tags.map(t => Number(t.count) || 0);
  const maxCount = Math.max(...tagCounts, 1);

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {tags.map(tag => {
        const count = Number(tag.count) || 0;
        const fontSize = minFont + ((count / maxCount) * (maxFont - minFont));
        
        return (
          <button
            key={tag.id}
            onClick={() => onTagClick?.(tag.name)}
            className="transition-all duration-200 hover:scale-110 hover:text-purple-800 dark:hover:text-purple-300"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 600,
              color: "#6D28D9",
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            title={`${tag.name} (used ${tag.count} time${count !== 1 ? 's' : ''})`}
            aria-label={`Filter by tag ${tag.name}`}
          >
            #{tag.name}
          </button>
        );
      })}
    </div>
  );
}