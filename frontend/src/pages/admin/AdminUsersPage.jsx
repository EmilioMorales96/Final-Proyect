import { useEffect, useState } from "react";
import api from "../utils/api"; // Helper to handle API requests

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/users").then(setUsers);
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id || user._id}>{user.name || user.email}</li>
        ))}
      </ul>
    </div>
  );
}