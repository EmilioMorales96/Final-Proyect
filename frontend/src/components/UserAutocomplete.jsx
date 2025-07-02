import React, { useState } from "react";

export default function UserAutocomplete({ selectedUsers, setSelectedUsers }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Simulate user search
  const handleSearch = async (q) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    // Here should fetch from API: `/api/users?search=${q}`
    // Simulation:
    setResults([
      { id: 1, name: "John Smith", email: "john@email.com" },
      { id: 2, name: "Anna Lopez", email: "anna@email.com" },
    ].filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  };

  const addUser = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setQuery("");
    setResults([]);
  };

  const removeUser = (id) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== id));
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Users with access</label>
      <input
        type="text"
        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 mb-2"
        placeholder="Search user by name or email..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow max-h-40 overflow-y-auto mb-2">
          {results.map(user => (
            <li
              key={user.id}
              className="px-3 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
              onClick={() => addUser(user)}
            >
              {user.name} <span className="text-xs text-gray-500">({user.email})</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map(user => (
          <span key={user.id} className="bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 px-2 py-1 rounded flex items-center gap-1">
            {user.name}
            <button type="button" className="ml-1 text-xs" onClick={() => removeUser(user.id)}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}