import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  const theme = isDarkMode ? "dark" : "light";

  return (
    <button
      onClick={toggleTheme}
      className="px-1 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
    >
      {theme === "dark" ? "🌙 Oscuro" : "☀️ Claro"}
    </button>
  );
}
