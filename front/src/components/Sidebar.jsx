// components/Sidebar.jsx

import { useNavigate } from "react-router-dom";
import { getSectionRoute } from "../routes/routes";
import ThemeToggle from "../theme/ThemeToggle";
import React from "react";
import LogoBlueberry from "../logos/LogoBlueberry";

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
    const navigate = useNavigate();

    const handleMouseEnter = () => setSidebarOpen(true);
    const handleMouseLeave = () => setSidebarOpen(false);

    const handleSectionClick = (sectionKey) => {
        setSelectedButton(sectionKey);
        const route = getSectionRoute(sectionKey);
        navigate(route);
    };

    return (
        <aside
            className={`bg-blue shadow-lg flex flex-col border-r border-gray-200 ${sidebarOpen ? "w-[220px]" : "w-[50px]"
                } transition-width duration-300 ease-in-out relative z-10`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ minWidth: sidebarOpen ? 220 : 50 }}
        >
            {/* Navegación Packing */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mb-8">
                    <button
                        onClick={() => setPackingExpanded(!packingExpanded)}
                        className={`w-full flex items-center p-3 rounded-md cursor-pointer ${sidebarOpen ? "justify-between" : "justify-center"
                            } hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors duration-200`}
                        aria-expanded={packingExpanded}
                        aria-controls="packing-menu"
                    >
                        {sidebarOpen ? (
                            <>
                                <span className="flex items-center space-x-3 text-gray-700 dark:text-white">
                                    <div className="p-2 rounded-md bg-blue-50">
                                        <LogoBlueberry size="md" />
                                        {/*   <svg
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
                    </svg> */}
                                    </div>
                                    <span className="text-base font-semibold">Packing</span>
                                </span>
                                <span
                                    className={`transition-transform duration-300 text-gray-400 dark:text-white ${packingExpanded ? "rotate-180" : ""
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
                                {/*                                 <LogoBlueberry size="sm" />
 */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="h-6 w-6 text-blue-500" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 10h18M7 6h10M5 14h14M9 18h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                                                    handleSectionClick(sectionKey);
                                                }
                                                if (!sidebarOpen) setSidebarOpen(true);
                                            }}
                                            className={`w-full flex items-center rounded-md text-gray-600 dark:text-white text-sm px-4 py-2 transition-colors duration-200 ${sidebarOpen ? "justify-between" : "justify-center"
                                                } ${isSelected
                                                    ? "bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-white font-semibold"
                                                    : "hover:bg-blue-100 dark:hover:bg-gray-600 hover:text-blue-600"
                                                }`}
                                            aria-current={isSelected ? "page" : undefined}
                                            aria-expanded={
                                                section.submenus ? expandedVolcado : undefined
                                            }
                                            aria-haspopup={section.submenus ? true : undefined}
                                            title={!sidebarOpen ? sectionName : undefined}
                                        >
                                            {sidebarOpen ? (
                                                <>
                                                    <span className="truncate">{sectionName}</span>
                                                    {section.submenus && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 text-blue-400 dark:text-white transition-transform duration-300 ${expandedVolcado ? "rotate-180" : ""
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
                                                <span className="text-xs font-medium dark:text-white">
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
                                                        onClick={() => handleSectionClick(submenu.key)}
                                                        className={`w-full text-left rounded-md text-blue-600 dark:text-white text-xs px-3 py-1 transition-colors duration-200 ${selectedButton === submenu.key
                                                            ? "bg-blue-300 dark:bg-blue-700 font-semibold"
                                                            : "hover:bg-blue-100 dark:hover:bg-gray-600"
                                                            }`}
                                                        aria-current={
                                                            selectedButton === submenu.key
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        title={!sidebarOpen ? submenu.name : undefined}
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

            {/* Footer: Theme toggle */}
            <div
                className={`py-3 border-t border-gray-200 dark:border-gray-700 ${sidebarOpen ? "px-4" : "px-2"
                    }`}
            >
                <div className="flex items-center justify-center">
                    <ThemeToggle sidebarOpen={sidebarOpen} />
                </div>
            </div>
        </aside>
    );
}
