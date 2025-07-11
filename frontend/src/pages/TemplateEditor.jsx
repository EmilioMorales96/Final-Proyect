import React, { useState } from "react";
import UserAutocomplete from "../components/UserAutocomplete";
import TagSelector from "../components/TagSelector";

const API_URL = import.meta.env.VITE_API_URL;

export default function TemplateEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState("public");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tags, setTags] = useState([]); // Estado para los tags seleccionados

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      accessType,
      allowedUsers: accessType === "restricted" ? selectedUsers.map(u => u.id) : [],
      tags, // <-- envía los tags seleccionados al backend
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // Maneja el error aquí si lo deseas
        console.error("Error saving template");
      } else {
        // Maneja el éxito aquí si lo deseas
        console.log("Template saved!");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create/Edit Template</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Visibility</label>
          <select
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
            value={accessType}
            onChange={e => setAccessType(e.target.value)}
          >
            <option value="public">Public (all authenticated users)</option>
            <option value="restricted">Restricted (only selected users)</option>
          </select>
        </div>
        {accessType === "restricted" && (
          <UserAutocomplete selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
        )}
        <div>
          <label className="block font-semibold mb-1">Tags</label>
          <TagSelector value={tags} onChange={setTags} />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-bold text-lg shadow hover:from-purple-800 hover:to-indigo-900 transition-all"
        >
          Save template
        </button>
      </form>
    </div>
  );
}