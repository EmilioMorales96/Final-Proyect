import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    api.get("/api/users")
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 2500);
  };

  const handleBlock = async (id) => {
    await api.put(`/api/users/admin/${id}/block`);
    notify("User blocked.");
    fetchUsers();
  };
  const handleUnblock = async (id) => {
    await api.put(`/api/users/admin/${id}/unblock`);
    notify("User unblocked.");
    fetchUsers();
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/api/users/admin/${id}`);
    notify("User deleted.");
    fetchUsers();
  };
  const handlePromote = async (id) => {
    await api.put(`/api/users/admin/${id}/promote`);
    notify("User promoted to admin.");
    fetchUsers();
  };
  const handleDemote = async (id) => {
    await api.put(`/api/users/admin/${id}/demote`);
    notify("Admin rights removed.");
    fetchUsers();
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <Link
          to="/admin"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
        >
          ← Back to Admin Panel
        </Link>
      </div>
      {notif && (
        <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 font-semibold shadow animate-fade-in">
          {notif}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Blocked</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 font-semibold">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 font-semibold">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 text-gray-700">{user.id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={user.avatar || "/avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-indigo-200 shadow"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
                      {user.isBlocked ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    {user.isBlocked ? (
                      <button
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow transition"
                        onClick={() => handleUnblock(user.id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold shadow transition"
                        onClick={() => handleBlock(user.id)}
                      >
                        Block
                      </button>
                    )}
                    <button
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                    {user.role === "admin" ? (
                      <button
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-semibold shadow transition"
                        onClick={() => handleDemote(user.id)}
                      >
                        Remove admin
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow transition"
                        onClick={() => handlePromote(user.id)}
                      >
                        Promote to admin
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}