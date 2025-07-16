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
  const handleMouseEnter = () => setSidebarOpen(true);
  const handleMouseLeave = () => setSidebarOpen(false);

  return (
    <motion.aside
      className="bg-gray-950/95 border-r border-cyan-400/5 flex flex-col backdrop-blur-sm"
      initial={{ width: 260 }}
      animate={{ width: sidebarOpen ? 260 : 80 }}
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
            <h2 className="text-lg font-light text-cyan-50 tracking-widest">
              PACK<span className="text-cyan-400">ING</span>
            </h2>
          </motion.div>
        ) : (
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
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-cyan-300 transition-all p-1 rounded-lg hover:bg-gray-900/50"
        >
          {sidebarOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navegación Packing */}
      <nav className="flex-1 overflow-y-auto py-3 px-1">
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
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    Packing
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: packingExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </>
            ) : (
              <div className="p-1 rounded-md bg-gray-900/80 border border-gray-800">
                <svg
                  className="w-4 h-4 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </button>

          <AnimatePresence>
            {packingExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-lg mt-1"
              >
                {packingSections.map((section) => {
                  const sectionName =
                    typeof section === "object" ? section.name : section;
                  const sectionKey =
                    typeof section === "object" ? section.name : section;
                  const isSelected =
                    selectedButton === sectionKey ||
                    (section.submenus &&
                      section.submenus.some(
                        (sub) => sub.key === selectedButton
                      ));

                  return (
                    <div key={sectionKey}>
                      <motion.button
                        onClick={() => {
                          if (section.submenus) {
                            setExpandedVolcado(!expandedVolcado);
                          } else {
                            setSelectedButton(sectionKey);
                          }
                          if (!sidebarOpen) setSidebarOpen(true);
                        }}
                        className={`w-full text-left p-2.5 ${
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
                              <motion.span
                                animate={{ rotate: expandedVolcado ? 180 : 0 }}
                                className="text-gray-500"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 9l-7 7-7-7" />
                                </svg>
                              </motion.span>
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
                              className={`w-full text-left p-2 pl-8 text-xs rounded-md ${
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

      {/* Footer */}
      <div className="p-3 border-t border-gray-800/50 text-xs text-gray-500 text-center">
        {sidebarOpen ? <span>v1.0.0</span> : <span>v1</span>}
      </div>
    </motion.aside>
  );
}
