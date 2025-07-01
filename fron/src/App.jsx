import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Bienvenida from "./components/Bienvenida";
import Header from "./components/Header";
import { fetchData } from "./utils/api";
// Importar componentes de tablas

// Componentes para Arándano
import TablaRecepcionArandano from "./components/TablaRecepcionArandano";
import TablaGasificadoArandano from "./components/TablaGasificadoArandano";
import TablaEsperaArandano from "./components/TablaEsperaArandano";
import TablaLineaVolcadoArandano from "./components/TablaLineaVolcadoArandano";
import TablaFrioArandano from "./components/TablaFrioArandano";
import TablaOrdenesArandano from "./components/TablaOrdenesArandano";

// Mapeo de endpoints actualizado
const endpointMap = {
  Arandano: {
    RECEPCIÓN: "recepcionAran",
    "GASIFICADO PRE FRÍO": "gasificadoPreFrioAran",
    "VOLCADO/ESPERA": "esperaVolcadoAran",
    "VOLCADO/LÍNEA": "avanceLinea",
    FRIO: "esperaFrioAran",
    "ORDEN PRD": "ordenesPTAran",
  },
};

// Mapeo de componentes de tabla actualizado
const tablaMap = {
  Arandano: {
    RECEPCIÓN: TablaRecepcionArandano,
    "GASIFICADO PRE FRÍO": TablaGasificadoArandano,
    "VOLCADO/ESPERA": TablaEsperaArandano,
    "VOLCADO/LÍNEA": TablaLineaVolcadoArandano,
    FRIO: TablaFrioArandano,
    "ORDEN PRD": TablaOrdenesArandano,
  },
};

const App = () => {
  // Estados
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Arandano");
  const [selectedButton, setSelectedButton] = useState("RECEPCIÓN");
  const [data, setData] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const intervaloRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [packingExpanded, setPackingExpanded] = useState(true);
  const [expandedVolcado, setExpandedVolcado] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Secciones de packing con estructura jerárquica
  const packingSections = [
    "RECEPCIÓN",
    "GASIFICADO PRE FRÍO",
    {
      name: "VOLCADO",
      submenus: [
        { name: "ESPERA", key: "VOLCADO/ESPERA" },
        { name: "LÍNEA", key: "VOLCADO/LÍNEA" },
      ],
    },
    "FRIO",
    "ORDEN PRD",
  ];

  const handleStart = () => {
    setMostrarBienvenida(false);
  };

  // Función para cargar datos
  const cargarDatos = async () => {
    if (!selectedButton || !selectedOption) return;

    const endpoint = endpointMap[selectedOption]?.[selectedButton];
    if (!endpoint) return;

    try {
      const response = await fetchData(endpoint);
      setData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(response)) {
          setUltimaActualizacion(new Date());
          return response;
        }
        return prevData;
      });
    } catch (error) {
      console.error(`Error cargando datos de ${endpoint}:`, error);
    }
  };

  // Configurar intervalo de actualización
  useEffect(() => {
    const manejarActualizacion = () => cargarDatos();
    const intervaloId = setInterval(manejarActualizacion, 8000);
    intervaloRef.current = intervaloId;
    cargarDatos();
    return () => clearInterval(intervaloId);
  }, []);

  // Actualizar al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) cargarDatos();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Manejar hover del sidebar
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
    setSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setSidebarOpen(false), 300);
  };

  useEffect(() => {
    return () => clearTimeout(hoverTimeoutRef.current);
  }, [selectedOption, selectedButton]);

  // Render de tablas
  const renderTablas = () => {
    const ComponenteTabla = tablaMap[selectedOption]?.[selectedButton];

    if (!ComponenteTabla) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Selecciona una sección
            </h3>
            <p className="mt-1 text-gray-500">
              Elige una sección del menú Packing para ver las tablas
            </p>
          </div>
        </div>
      );
    }

    return <ComponenteTabla data={data} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        className="bg-gray-950/95 border-r border-cyan-400/5 flex flex-col backdrop-blur-sm"
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo/Header */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-cyan-300 transition-all p-1 rounded-lg hover:bg-gray-900/50"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-1">
          {/* Packing Section */}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      Packing
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: packingExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
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
                  transition={{ duration: 0.25 }}
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
                          whileHover={{
                            backgroundColor: "rgba(17, 24, 39, 0.5)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {sidebarOpen ? (
                            <div className="flex items-center justify-between w-full">
                              <span>{sectionName}</span>
                              {section.submenus && (
                                <motion.span
                                  animate={{
                                    rotate: expandedVolcado ? 180 : 0,
                                  }}
                                  className="text-gray-500"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
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

                        {/* Submenús para VOLCADO */}
                        {section.submenus && expandedVolcado && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 border-l border-gray-800/50"
                          >
                            {section.submenus.map((submenu) => (
                              <motion.button
                                key={submenu.key}
                                onClick={() => setSelectedButton(submenu.key)}
                                className={`w-full text-left p-2 pl-8 text-xs rounded-md ${
                                  selectedButton === submenu.key
                                    ? "text-cyan-300"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}
                                whileHover={{
                                  backgroundColor: "rgba(17, 24, 39, 0.3)",
                                }}
                                whileTap={{ scale: 0.98 }}
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

        {/* Sidebar footer */}
        <div className="p-3 border-t border-gray-800/50">
          {sidebarOpen ? (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>v1.0.0</span>
              <button className="hover:text-cyan-300 transition-colors p-1 rounded-md hover:bg-gray-900/50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button className="text-gray-500 hover:text-cyan-300 transition-colors p-1 rounded-md hover:bg-gray-900/50">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {mostrarBienvenida ? (
          <Bienvenida onStart={handleStart} />
        ) : (
          <>
            <Header logoSrc="/santa.png" />

            <main className="flex-1 overflow-y-auto p-1 bg-gradient-to-b from-gray-50 to-gray-100">
              {renderTablas()}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
