import useRedirectIfAuthenticated from "../hooks/useRedirectIfAuthenticated";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
const API_URL = import.meta.env.VITE_API_URL;

const COLORS = {
  primary: "#5E35B1",
  secondary: "#43A047",
  accent: "#FFC107",
  danger: "#E53935",
  bg: "#f5f5f5",
  card: "#ffffff",
  border: "#e0e0e0",
  text: "#212121",
  muted: "#757575",
  gradient: "linear-gradient(135deg, #5E35B1 0%, #3949AB 100%)"
};

export default function Register() {
  useRedirectIfAuthenticated();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Email validation
    if (!emailRegex.test(email)) {
      setError("Registration error: the email address must have a valid extension (e.g., .com, .net, .org)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      console.log("Status:", res.status);
      console.log("Response data:", data);
      if (!res.ok) {
        setError(data.message || "Could not register");
      } else {
        setSuccess("Registration successful! You can now log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/welcome");
      }
    } catch (err) {
      setError("Network or server error");
      console.error("Network/server error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 register-animated-bg" />
      <div className="relative z-10 flex min-h-screen items-center justify-center font-sans">
        <div className="w-full max-w-[450px] bg-white/90 dark:bg-gray-800/90 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">Register</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Create an account to start using FormsApp</p>
          </div>
          
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Name</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="text"
                placeholder="Your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Password</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="password"
                placeholder="••••••••"
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
              {loading ? "Registering..." : "Register"}
            </button>
            {error && (
              <div className="text-center text-red-600 dark:text-red-400 font-medium text-sm py-3 rounded bg-red-50 dark:bg-red-900/30 animate-fade-in">{error}</div>
            )}
            {success && (
              <div className="text-center text-green-600 dark:text-green-400 font-medium text-sm py-3 rounded bg-green-50 dark:bg-green-900/30 animate-fade-in">{success}</div>
            )}
          </form>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          {/* Google OAuth Button */}
          <GoogleAuthButton text="Sign up with Google" />
          
          <div className="text-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-purple-700 dark:text-purple-400 font-semibold hover:underline"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


