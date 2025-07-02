import { createContext, useContext, useState, useEffect } from "react";

const AppSettingsContext = createContext();

export function AppSettingsProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode preference in localStorage
    // If darkMode is not set, default to false
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <AppSettingsContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}