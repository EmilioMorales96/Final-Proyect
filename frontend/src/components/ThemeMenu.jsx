import { useAppSettings } from '../context/AppSettingsContext';
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function ThemeMenu() {
  const { darkMode, setDarkMode } = useAppSettings();

  return (
    <button
      className="flex items-center gap-2 px-5 py-2 w-full rounded hover:bg-purple-50 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100"
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Change theme"
      type="button"
    >
      {darkMode ? (
        <>
          <MdLightMode className="text-xl text-yellow-500" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <MdDarkMode className="text-xl text-purple-700 dark:text-purple-300" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}