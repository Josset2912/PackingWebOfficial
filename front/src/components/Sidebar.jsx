// components/Sidebar.jsx

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
    <aside
      className={`bg-gray-950/95 border-r border-cyan-400/5 flex flex-col backdrop-blur-sm ${
        sidebarOpen ? "w-[260px]" : "w-[35px]"
      } transition-[width] duration-400 ease-[cubic-bezier(0.33,1,0.68,1)]`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: sidebarOpen ? 260 : 35 }}
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-gray-800/50">
        {sidebarOpen ? (
          <div className="flex items-center space-x-2 transition-opacity duration-300">
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
          </div>
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
          aria-label="Toggle sidebar"
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
                <span
                  style={{
                    display: "inline-block",
                    transition: "transform 0.2s",
                    transform: packingExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </>
            ) : (
              <div className="p-0 rounded-md bg-gray-900/80 border border-gray-800">
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

          {packingExpanded && (
            <div className="overflow-hidden rounded-lg transition-all duration-300">
              {packingSections.map((section) => {
                const sectionName =
                  typeof section === "object" ? section.name : section;
                const sectionKey =
                  typeof section === "object" ? section.name : section;
                const isSelected =
                  selectedButton === sectionKey ||
                  (section.submenus &&
                    section.submenus.some((sub) => sub.key === selectedButton));

                return (
                  <div key={sectionKey}>
                    <button
                      onClick={() => {
                        if (section.submenus) {
                          setExpandedVolcado(!expandedVolcado);
                        } else {
                          setSelectedButton(sectionKey);
                        }
                        if (!sidebarOpen) setSidebarOpen(true);
                      }}
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
                            <span
                              className="text-gray-500"
                              style={{
                                display: "inline-block",
                                transition: "transform 0.2s",
                                transform: expandedVolcado
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium">
                          {sectionName.charAt(0)}
                        </span>
                      )}
                    </button>

                    {section.submenus && expandedVolcado && (
                      <div className="ml-6 border-l border-gray-800/50">
                        {section.submenus.map((submenu) => (
                          <button
                            key={submenu.key}
                            onClick={() => setSelectedButton(submenu.key)}
                            className={`w-full text-left p-1 pl-2 text-xs rounded-md ${
                              selectedButton === submenu.key
                                ? "text-cyan-300"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            → {submenu.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
