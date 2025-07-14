import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { FiCamera } from "react-icons/fi";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import SalesforceIntegration from "../components/SalesforceIntegration";
import ApiTokenManager from "../components/ApiTokenManager";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  // --- Profile update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error updating profile");
      } else {
        setSuccess("Profile updated successfully");
        // Update user in context
        login(data.user, localStorage.getItem("token"));
      }
    } catch {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  // --- Password update ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");
    setPasswordLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "Error changing password");
      } else {
        setPasswordSuccess("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setPasswordError("Network or server error");
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Avatar update ---
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    setAvatarSuccess("");
    setAvatarError("");
    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const res = await fetch(`${API_URL}/api/users/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setAvatarError(data.message || "Error uploading avatar");
      } else {
        setAvatarSuccess("Avatar updated successfully");
        setAvatarUrl(data.user.avatar);
        login(data.user, localStorage.getItem("token"));
      }
    } catch {
      setAvatarError("Network or server error");
    } finally {
      setAvatarLoading(false);
    }
  };

  console.log("Profile loaded");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-2 flex flex-col items-center animate-fade-in">
      {/* User card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-xl flex flex-col items-center mb-10 relative animate-fade-in-up">
        <div className="relative group mb-4">
          <img
            src={avatarUrl || "/avatar-placeholder.svg"}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-md object-cover bg-white dark:bg-gray-900 transition"
          />
          <form
            onSubmit={handleAvatarUpload}
            className="absolute bottom-2 right-2"
            title="Change avatar"
          >
            <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow transition flex items-center">
              <FiCamera className="text-lg" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={avatarLoading}
              />
            </label>
            {avatar && (
              <button
                type="submit"
                className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-semibold shadow transition"
                disabled={avatarLoading}
              >
                {avatarLoading ? "Uploading..." : "Save"}
              </button>
            )}
          </form>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{user.name}</h2>
        <p className="text-purple-700 dark:text-purple-400 mb-2">{user.email}</p>
        <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-1 rounded-full font-bold text-sm mb-2">
          {user.role}
        </span>
        {avatarSuccess && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2 animate-fade-in">
            <FaCheckCircle /> {avatarSuccess}
          </div>
        )}
        {avatarError && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mt-2 animate-fade-in">
            <FaExclamationCircle /> {avatarError}
          </div>
        )}
      </div>

      {/* Profile form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-xl mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Name</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Email</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg shadow transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          {success && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2 animate-fade-in">
              <FaCheckCircle /> {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mt-2 animate-fade-in">
              <FaExclamationCircle /> {error}
            </div>
          )}
        </form>
      </div>

      {/* Password change form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-xl mb-10 animate-fade-in-up">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Change password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Current password</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">New password</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="New password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg shadow transition"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Saving..." : "Change password"}
          </button>
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2 animate-fade-in">
              <FaCheckCircle /> {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mt-2 animate-fade-in">
              <FaExclamationCircle /> {passwordError}
            </div>
          )}
        </form>
      </div>

      {/* External Integrations Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">External Integrations</h2>
        
        {/* Salesforce Integration */}
        <SalesforceIntegration />
        
        {/* API Token Manager */}
        <ApiTokenManager />
      </div>

    </div>
  );
}