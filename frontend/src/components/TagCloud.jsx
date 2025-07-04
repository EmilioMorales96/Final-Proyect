import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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