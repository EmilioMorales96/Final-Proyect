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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h2>
          <Link
            to="/admin"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            ← Back to Admin Panel
          </Link>
        </div>
        
        {notif && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold shadow-lg border border-green-200 dark:border-green-700 animate-fade-in">
            {notif}
          </div>
        )}
        
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-50 dark:bg-indigo-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400 font-semibold">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400 font-semibold">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">👥</span>
                      No users found.
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{user.id}</td>
                    <td className="px-6 py-4">
                      <img
                        src={user.avatar || "/avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-indigo-200 dark:border-indigo-600 shadow-md"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{user.username}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "admin" 
                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.isBlocked 
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" 
                          : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      }`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      {user.isBlocked ? (
                        <button
                          className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleUnblock(user.id)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleBlock(user.id)}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                      {user.role === "admin" ? (
                        <button
                          className="px-3 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleDemote(user.id)}
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handlePromote(user.id)}
                        >
                          Promote to Admin
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
    </div>
  );
}