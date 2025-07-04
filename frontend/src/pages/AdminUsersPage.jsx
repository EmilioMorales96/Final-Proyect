import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const PAGE_SIZE = 10;

function usersToCSV(users) {
  if (!users.length) return "";
  const headers = ["id", "username", "email", "role", "isBlocked", "createdAt"];
  const rows = users.map(u =>
    headers.map(h => {
      let val = u[h];
      if (typeof val === "boolean") return val ? "Yes" : "No";
      if (val === null || val === undefined) return "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\r\n");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [userId]: true/false }
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [blockedFilter, setBlockedFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Error fetching users.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    let url = `${API_URL}/api/users/admin/${id}/${action}`;
    let method = action === "delete" ? "DELETE" : "PUT";
    try {
      // Confirmación antes de eliminar
      if (action === "delete") {
        const confirm = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!confirm) {
          setActionLoading(prev => ({ ...prev, [id]: false }));
          return;
        }
      }
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Action completed successfully.");
        fetchUsers();
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (err) {
      toast.error("Network error.");
    }
    setActionLoading(prev => ({ ...prev, [id]: false }));
  };

  // Filtros y búsqueda
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesBlocked =
      blockedFilter === "all" ||
      (blockedFilter === "blocked" && u.isBlocked) ||
      (blockedFilter === "active" && !u.isBlocked);
    return matchesSearch && matchesRole && matchesBlocked;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => setPage(p);

  // Exportar a CSV
  const handleExportCSV = () => {
    const csv = usersToCSV(filteredUsers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Administration</h2>

      {/* Botón de exportación */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Export to CSV
        </button>
        {/* ...resto de filtros y búsqueda... */}
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg w-64"
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={blockedFilter}
          onChange={e => { setBlockedFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <table className="w-full border rounded shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-400">No users found.</td>
            </tr>
          )}
          {paginatedUsers.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                {u.isBlocked
                  ? <span className="text-red-600 font-semibold">Yes</span>
                  : <span className="text-green-600 font-semibold">No</span>
                }
              </td>
              <td className="flex flex-wrap gap-2 py-2">
                {u.isBlocked
                  ? <button
                      onClick={() => handleAction(u.id, "unblock")}
                      className="px-3 py-1 rounded bg-green-100 text-green-800 font-semibold hover:bg-green-200 transition disabled:opacity-60"
                      disabled={!!actionLoading[u.id]}
                    >
                      {actionLoading[u.id] ? "..." : "Unblock"}
                    </button>
                  : <button
                      onClick={() => handleAction(u.id, "block")}
                      className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 transition disabled:opacity-60"
                      disabled={!!actionLoading[u.id]}
                    >
                      {actionLoading[u.id] ? "..." : "Block"}
                    </button>
                }
                <button
                  onClick={() => handleAction(u.id, "delete")}
                  className="px-3 py-1 rounded bg-red-100 text-red-800 font-semibold hover:bg-red-200 transition disabled:opacity-60"
                  disabled={!!actionLoading[u.id]}
                >
                  {actionLoading[u.id] ? "..." : "Delete"}
                </button>
                {u.role === "admin"
                  ? <button
                      onClick={() => handleAction(u.id, "demote")}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition disabled:opacity-60"
                      disabled={!!actionLoading[u.id]}
                    >
                      {actionLoading[u.id] ? "..." : "Remove admin"}
                    </button>
                  : <button
                      onClick={() => handleAction(u.id, "promote")}
                      className="px-3 py-1 rounded bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 transition disabled:opacity-60"
                      disabled={!!actionLoading[u.id]}
                    >
                      {actionLoading[u.id] ? "..." : "Make admin"}
                    </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"} font-semibold hover:bg-indigo-500 hover:text-white transition`}
              disabled={page === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}