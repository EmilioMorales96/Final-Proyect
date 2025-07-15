import { useContext } from "react";
import AppSettingsContext from "../context/AppSettingsContext";

/**
 * Custom hook to access application settings context
 * Provides access to app-wide settings like theme preferences
 * 
 * @returns {Object} App settings context value containing:
 *   - darkMode: Boolean indicating if dark mode is enabled
 *   - setDarkMode: Function to toggle dark mode preference
 */
export function useAppSettings() {
  return useContext(AppSettingsContext);
}
