import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeMenu from "./ThemeMenu";
import { HiOutlineUserCircle, HiOutlineChevronDown, HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
import { MdDarkMode, MdAdminPanelSettings } from "react-icons/md";

export default function UserMenu({ user }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        type="button"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <HiOutlineUserCircle className="text-3xl" />
        )}
        <span className="hidden md:inline font-medium">
          {user?.name || user?.email}
        </span>
        <HiOutlineChevronDown className={`text-xl transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <HiOutlineUserCircle className="text-4xl" />
            )}
            <div>
              <div className="font-semibold">{user?.name || "User"}</div>
              <div className="text-xs opacity-80">{user?.email}</div>
            </div>
          </div>
          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-5 py-2 text-gray-800 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-gray-800 transition"
              onClick={() => setOpen(false)}
            >
              <HiOutlineUser className="text-purple-700 dark:text-purple-300" />
              My profile
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/users"
                className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition my-2"
                onClick={() => setOpen(false)}
              >
                <MdAdminPanelSettings className="text-2xl" />
                Admin panel
              </Link>
            )}
            <ThemeMenu />
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700" />
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex items-center gap-2 w-full text-left px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition font-semibold"
          >
            <HiOutlineLogout />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}