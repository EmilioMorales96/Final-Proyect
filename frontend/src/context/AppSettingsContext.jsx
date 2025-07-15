import { createContext, useState, useEffect } from "react";

/**
 * Application settings context for managing app-wide settings
 * Currently manages dark mode theme preference
 */
const AppSettingsContext = createContext();

/**
 * Application settings provider component
 * Manages application settings like theme preferences
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} App settings context provider
 */
export function AppSettingsProvider({ children }) {
  // Initialize dark mode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  // Apply dark mode class to body and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <AppSettingsContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export default AppSettingsContext;