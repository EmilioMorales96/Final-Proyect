import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useRedirectIfAuthenticated from "../hooks/useRedirectIfAuthenticated";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  useRedirectIfAuthenticated();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        const userWithToken = { ...data.user, token: data.token };
        localStorage.setItem("user", JSON.stringify(userWithToken));
        login(userWithToken, data.token);
        window.location.href = "/";
      }
    } catch {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center font-sans login-animated-bg transition-colors duration-1000">
      <div className="w-full max-w-[450px] bg-white/90 dark:bg-gray-800/90 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md animate-fade-in-up">
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2 animate-pulse">Log in</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Enter your credentials to access</p>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg shadow transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            {error && (
              <div className="text-center text-red-600 dark:text-red-400 font-medium text-sm py-3 rounded bg-red-50 dark:bg-red-900/30 animate-fade-in">{error}</div>
            )}
          </form>
          <div className="text-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-purple-700 dark:text-purple-400 font-semibold hover:underline"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}