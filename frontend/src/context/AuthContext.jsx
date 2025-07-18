import { createContext, useState } from "react";

/**
 * Authentication context for managing user authentication state
 * Provides user data, authentication token, and auth-related functions
 */
const AuthContext = createContext();

/**
 * Authentication provider component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth context provider
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login solo actualiza el usuario
  function login(userData) {
    setUser(userData);
  }

  // Logout llama a api.logout y redirige
  async function logout() {
    try {
      // Llama al endpoint para limpiar la cookie
      await import('../utils/api.js').then(m => m.default.logout());
    } catch (e) {
      // Ignorar error de red
    }
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;