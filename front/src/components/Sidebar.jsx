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
      className={`bg-blue shadow-lg flex flex-col border-r border-gray-200 ${
        sidebarOpen ? "w-[220px]" : "w-[50px]"
      } transition-width duration-300 ease-in-out`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: sidebarOpen ? 220 : 50 }}
    >
      {/* Header */}
      {/* ... tu header aquí ... */}

      {/* Navegación Packing */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="mb-8">
                  
          <button
            onClick={() => setPackingExpanded(!packingExpanded)}
            className={`w-full flex items-center p-3 rounded-md cursor-pointer ${
              sidebarOpen ? "justify-between" : "justify-center"
            } hover:bg-blue-100 transition-colors duration-200`}
            aria-expanded={packingExpanded}
            aria-controls="packing-menu"
          >
            {sidebarOpen ? (
              <>
                <span className="flex items-center space-x-3 text-gray-700">
                  <div className="p-2 rounded-md bg-blue-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 6h10M5 14h14M9 18h6"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-semibold">Packing</span>
                </span>
                <span
                  className={`transition-transform duration-300 text-gray-400 ${
                    packingExpanded ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <div className="p-2 rounded-md bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 6h10M5 14h14M9 18h6"
                  />
                </svg>
              </div>
            )}
          </button>

          {packingExpanded && (
            <div id="packing-menu" className="mt-2 space-y-1">
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
                      className={`w-full flex items-center rounded-md text-gray-600 text-sm px-4 py-2 transition-colors duration-200 ${
                        sidebarOpen ? "justify-between" : "justify-center"
                      } ${
                        isSelected
                          ? "bg-blue-200 text-blue-700 font-semibold"
                          : "hover:bg-blue-100 hover:text-blue-600"
                      }`}
                      aria-current={isSelected ? "page" : undefined}
                      aria-expanded={
                        section.submenus ? expandedVolcado : undefined
                      }
                      aria-haspopup={section.submenus ? true : undefined}
                      title={!sidebarOpen ? sectionName : undefined} // Tooltip solo si está cerrado
                    >
                      {sidebarOpen ? (
                        <>
                          <span className="truncate">{sectionName}</span>{" "}
                          {/* Trunca texto si no cabe */}
                          {section.submenus && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 text-blue-400 transition-transform duration-300 ${
                                expandedVolcado ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-medium">
                          {sectionName.charAt(0)}
                        </span>
                      )}
                    </button>

                    {/* Submenús */}
                    {section.submenus && expandedVolcado && (
                      <div className="ml-8 mt-1 space-y-1 border-l border-blue-300 pl-3">
                        {section.submenus.map((submenu) => (
                          <button
                            key={submenu.key}
                            onClick={() => setSelectedButton(submenu.key)}
                            className={`w-full text-left rounded-md text-blue-600 text-xs px-3 py-1 transition-colors duration-200 ${
                              selectedButton === submenu.key
                                ? "bg-blue-300 font-semibold"
                                : "hover:bg-blue-100"
                            }`}
                            aria-current={
                              selectedButton === submenu.key
                                ? "page"
                                : undefined
                            }
                            title={!sidebarOpen ? submenu.name : undefined} // Tooltip si sidebar cerrado
                          >
                            &rarr;{" "}
                            {sidebarOpen
                              ? submenu.name
                              : submenu.name.charAt(0)}
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
