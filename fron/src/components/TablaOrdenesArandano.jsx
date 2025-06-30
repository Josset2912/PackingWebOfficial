import { motion } from "framer-motion";

const TablaOrdenesArandano = ({ data }) => {
  const ordenesFiltradas = data.filter((row) => row.ORDEN > 0);
  const cantidadOrden = ordenesFiltradas.length;

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString("es-ES");

  return (
      <div className="container mx-auto p-0 max-w-7xl">
          
      {/* Encabezado principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Órdenes de Producción{" "}
          <span className="text-blue-600">({cantidadOrden})</span>
        </h2>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-xl md:text-2xl font-semibold text-blue-700">
            Semana Actual
          </span>
        </div>
      </motion.div>

      {/* Tabla de órdenes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto relative">
            {" "}
            {/* Contenedor para el scroll */}
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-blue-700 text-white">
                {" "}
                {/* Encabezado fijo */}
                <tr>
                  {[
                    "ORDEN",
                    "PRIORIDAD",
                    "DESTINO",
                    "PRESENTACIÓN",
                    "EJEC/PROY",
                    "F. DESPACHO",
                  ].map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-sm md:text-base font-semibold uppercase tracking-wider text-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8">
                      <div className="flex justify-center items-center">
                        <p className="text-lg text-gray-500 italic">
                          No hay órdenes disponibles
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-blue-50"
                      } hover:bg-blue-100`}
                    >
                      <td className="px-4 py-3 text-center text-gray-800 font-medium">
                        {row.Orden}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            row.Prioridad === "Alta"
                              ? "bg-red-100 text-red-800"
                              : row.Prioridad === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {row.Prioridad}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {row.Destino}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {row.Presentacion}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {row.Ejec_Proy}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-blue-700">
                        {formatearFecha(row.F_Despacho)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TablaOrdenesArandano;
