import { useTheme } from "../contexts/ThemeContext";
import { MoonIcon } from "../logos/MoonIcon";
import { SunIcon } from "../logos/SunIcon";

export default function ThemeToggle({ sidebarOpen = true }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? "dark" : "light";

  return (
    <button
      onClick={toggleTheme}
      className={`px-2 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 relative z-50 cursor-pointer flex items-center transition-all duration-300 ${
        sidebarOpen ? "gap-2 w-full justify-start" : "justify-center w-10 h-10"
      }`}
      style={{ pointerEvents: "auto" }}
      title={
        !sidebarOpen
          ? theme === "dark"
            ? "Modo Claro"
            : "Modo Oscuro"
          : undefined
      }
    >
      {theme === "dark" ? (
        <>
          <SunIcon size={20} />
          {sidebarOpen && <span>Claro</span>}
        </>
      ) : (
        <>
          <MoonIcon size={20} />
          {sidebarOpen && <span>Oscuro</span>}
        </>
      )}
    </button>
  );
}
