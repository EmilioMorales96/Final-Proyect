import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication context
 * Provides access to user data, token, and authentication functions
 * 
 * @returns {Object} Authentication context value containing:
 *   - user: Current user object or null
 *   - token: Authentication token or null
 *   - login: Function to login with user data and token
 *   - logout: Function to logout and clear authentication state
 *   - isAuthenticated: Boolean indicating if user is authenticated
 */
export function useAuth() {
  return useContext(AuthContext);
}