// components/Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  packingExpanded,
  setPackingExpanded,
  expandedVolcado,
  setExpandedVolcado,
  packingSections,
  selectedButton,
  setSelectedButton,
}) {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMouseEnter = () => setSidebarOpen(true);
  const handleMouseLeave = () => setSidebarOpen(false);

  const IconBox = () => (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 border border-cyan-400/10 shadow-[0_0_12px_-3px_rgba(34,211,238,0.3)]">
      <svg
        className="w-4 h-4 text-cyan-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
  );

  const ArrowIcon = ({ rotated }) => (
    <motion.span
      animate={{ rotate: rotated ? 180 : 0 }}
      className="text-gray-500"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </motion.span>
  );

  return (
    <motion.aside
      className="bg-gray-950/95 border-r border-cyan-400/5 flex flex-col backdrop-blur-sm"
      initial={{ width: 260 }}
      animate={{ width: sidebarOpen ? 260 : 35 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-gray-800/50">
        {sidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center space-x-2"
          >
            <IconBox />
            <h2 className="text-lg font-light text-cyan-50 tracking-widest">
              PACK<span className="text-white-400">ING</span>
            </h2>
          </motion.div>
        ) : (
          <IconBox />
        )}

        <button
          onClick={toggleSidebar}
          className="text-white-400 hover:text-cyan-300 transition-all p-1 rounded-lg hover:bg-gray-900/50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-2">
        <div className="mb-6">
          <button
            onClick={() => setPackingExpanded(!packingExpanded)}
            className={`w-full flex items-center p-2.5 hover:bg-gray-900/50 transition-all duration-200 rounded-lg mx-1 ${
              sidebarOpen ? "justify-between" : "justify-center"
            } ${packingExpanded ? "bg-gray-900/30" : ""}`}
          >
            {sidebarOpen ? (
              <>
                <span className="flex items-center space-x-2">
                  <div className="p-1 rounded-md bg-gray-900/80 border border-gray-800">
                    <IconBox />
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    Packing
                  </span>
                </span>
                <ArrowIcon rotated={packingExpanded} />
              </>
            ) : (
              <div className="p-0 rounded-md bg-gray-900/80 border border-gray-800">
                <IconBox />
              </div>
            )}
          </button>

          {/* Submenús */}
          <AnimatePresence>
            {packingExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-lg"
              >
                {packingSections.map((section) => {
                  const sectionName =
                    typeof section === "object" ? section.name : section;
                  const sectionKey = sectionName;
                  const isSelected =
                    selectedButton === sectionKey ||
                    section.submenus?.some((s) => s.key === selectedButton);

                  const toggleSection = () => {
                    if (section.submenus) {
                      setExpandedVolcado(!expandedVolcado);
                    } else {
                      setSelectedButton(sectionKey);
                    }
                    if (!sidebarOpen) setSidebarOpen(true);
                  };

                  return (
                    <div key={sectionKey}>
                      <motion.button
                        onClick={toggleSection}
                        className={`w-full text-left p-2 ${
                          sidebarOpen ? "pl-10" : "pl-2.5 flex justify-center"
                        } transition-all rounded-md text-sm ${
                          isSelected
                            ? "text-cyan-300 bg-gray-900/60 border-l border-cyan-400"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/40"
                        }`}
                      >
                        {sidebarOpen ? (
                          <div className="flex items-center justify-between w-full">
                            <span>{sectionName}</span>
                            {section.submenus && (
                              <ArrowIcon rotated={expandedVolcado} />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-medium">
                            {sectionName.charAt(0)}
                          </span>
                        )}
                      </motion.button>

                      {section.submenus && expandedVolcado && (
                        <motion.div className="ml-6 border-l border-gray-800/50">
                          {section.submenus.map((submenu) => (
                            <motion.button
                              key={submenu.key}
                              onClick={() => setSelectedButton(submenu.key)}
                              className={`w-full text-left p-1 pl-2 text-xs rounded-md ${
                                selectedButton === submenu.key
                                  ? "text-cyan-300"
                                  : "text-gray-500 hover:text-gray-300"
                              }`}
                            >
                              → {submenu.name}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.aside>
  );
}
