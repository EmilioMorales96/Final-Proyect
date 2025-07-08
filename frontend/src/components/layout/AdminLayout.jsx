import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: "🏠" },
  { to: "/admin/users", label: "Users", icon: "👤" },
  { to: "/admin/forms", label: "Forms", icon: "📝" },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-indigo-100 shadow-lg flex flex-col py-8 px-4">
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-10 text-center tracking-tight">
          Admin
        </h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition
                ${pathname === link.to
                  ? "bg-indigo-100 text-indigo-700 shadow"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"}
              `}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <Link
          to="/"
          className="mt-10 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition text-center"
        >
          ← Back to App
        </Link>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}