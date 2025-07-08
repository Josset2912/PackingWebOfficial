import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [packingExpanded, setPackingExpanded] = useState(false);

  // Datos de ejemplo para las secciones de packing
  const packingSections = [
    "RECEPCIÓN",
    "GASIFICADO PRE FRÍO",
    "ESPERA",
    "FRIO",
    "ORDEN PRD",
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        className="bg-gray-800 text-white flex flex-col"
        initial={{ width: 256 }}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold">Menú</h2>
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            {sidebarOpen ? "◄" : "►"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {/* Apartado Packing */}
          <div className="border-b border-gray-700">
            <button
              onClick={() => setPackingExpanded(!packingExpanded)}
              className={`w-full flex items-center p-4 hover:bg-gray-700 transition-colors ${
                sidebarOpen ? "justify-between" : "justify-center"
              }`}
            >
              {sidebarOpen ? (
                <>
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
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
                    Packing
                  </span>
                  <motion.span
                    animate={{ rotate: packingExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </>
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
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              )}
            </button>

            <AnimatePresence>
              {packingExpanded && sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-700"
                >
                  {packingSections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setSelectedSection(section)}
                      className={`w-full text-left p-3 pl-12 hover:bg-gray-600 transition-colors ${
                        selectedSection === section
                          ? "bg-gray-600 text-cyan-300"
                          : ""
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Otras secciones del sidebar pueden ir aquí */}
        </nav>
      </motion.aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          setSelectedButton={setSelectedSection} // Reutilizamos para mantener consistencia
        />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedSection ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Tablas de {selectedSection}
              </h2>

              {/* Aquí irían tus tablas dinámicas */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Datos de ejemplo */}
                    {[1, 2, 3].map((item) => (
                      <tr key={item}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Producto {item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item * 10}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item % 2 === 0
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item % 2 === 0 ? "Completado" : "En proceso"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
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
                  correspondientes
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Layout;

// Tu componente Header permanece igual
