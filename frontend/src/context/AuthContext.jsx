import { createContext, useState, useEffect } from "react";

/**
 * Authentication context for managing user authentication state
 * Provides user data, authentication token, and auth-related functions
 */
const AuthContext = createContext();

/**
 * Authentication provider component
 * Manages authentication state and persistence in localStorage
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth context provider
 */
export function AuthProvider({ children }) {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Initialize token state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Persist authentication state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  /**
   * Login function - sets user and token state
   * @param {Object} userData - User data object
   * @param {string} tokenData - Authentication token
   */
  function login(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
  }

  /**
   * Logout function - clears authentication state and redirects to login
   */
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContext };