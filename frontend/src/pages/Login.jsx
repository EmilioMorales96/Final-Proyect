import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useRedirectIfAuthenticated from "../hooks/useRedirectIfAuthenticated";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  useRedirectIfAuthenticated();
  const { t } = useTranslation();

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
        setError(data.message || t('login.failed'));
      } else {
        const userWithToken = { ...data.user, token: data.token };
        localStorage.setItem("user", JSON.stringify(userWithToken));
        login(userWithToken, data.token);
        window.location.href = "/";
      }
    } catch {
      setError(t('login.networkError'));
    } finally {
      setLoading(false);
    }
  };

  console.log("Login loaded");

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 login-animated-bg" />
      <div className="relative z-10 flex min-h-screen items-center justify-center font-sans">
        <div className="w-full max-w-[450px] bg-white/90 dark:bg-gray-800/90 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md animate-fade-in-up">
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2 animate-pulse">
                {t('login.title')}
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                {t('login.subtitle')}
              </p>
            </div>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  type="email"
                  placeholder={t('login.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  type="password"
                  placeholder={t('login.password')}
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
                {loading ? t('login.loading') : t('login.submit')}
              </button>
              {error && (
                <div className="text-center text-red-600 dark:text-red-400 font-medium text-sm py-3 rounded bg-red-50 dark:bg-red-900/30 animate-fade-in">
                  {error}
                </div>
              )}
            </form>
            
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">{t('login.divider')}</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            {/* Google OAuth Button */}
            <GoogleAuthButton text={t('login.google')} />
            
            <div className="text-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
              {t('login.noAccount')}{" "}
              <a
                href="/register"
                className="text-purple-700 dark:text-purple-400 font-semibold hover:underline"
              >
                {t('login.register')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}