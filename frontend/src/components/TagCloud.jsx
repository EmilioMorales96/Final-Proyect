import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * TagCloud - Interactive tag cloud component
 * Displays tags with font sizes proportional to their usage count
 * 
 * Features:
 * - Dynamic font sizing based on tag frequency
 * - Clickable tags for filtering
 * - Fetches tag data from API
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onTagClick - Callback when a tag is clicked
 * @returns {JSX.Element} Visual tag cloud with clickable tags
 */
export default function TagCloud({ onTagClick }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/tags/cloud`)
      .then(res => res.json())
      .then(setTags);
  }, []);

  // Calculate font size based on tag count
  const minFont = 14, maxFont = 32;
  const maxCount = Math.max(...tags.map(t => Number(t.count) || 1), 1);

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagClick?.(tag.name)}
          style={{
            fontSize: `${minFont + ((Number(tag.count) / maxCount) * (maxFont - minFont))}px`,
            fontWeight: 600,
            color: "#6D28D9",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
          title={`${tag.name} (${tag.count})`}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}