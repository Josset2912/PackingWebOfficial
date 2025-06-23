import { motion } from "framer-motion";

const TablaOrdenesArandano = ({ data }) => {
  const ordenesFiltradas = data.filter((row) => row.ORDEN > 0);
  const cantidadOrden = ordenesFiltradas.length;

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString("es-ES");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col mt-6 pb-12 px-8 lg:px-12"
    >
      {/* Encabezado principal */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Órdenes de Producción ({cantidadOrden})
        </h2>
        <span className="text-2xl font-semibold text-gray-600">Semana</span>
      </div>

      {/* Tabla de órdenes */}
      <div className="w-full max-w-screen-2xl mx-auto bg-white rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xl text-center">
            <thead className="sticky top-0 z-10 bg-blue-700 text-white text-2xl">
              <tr>
                {[
                  "ORDEN",
                  "PRIORIDAD",
                  "DESTINO",
                  "PRESENTACIÓN",
                  "EJEC/PROY",
                  "F. DESPACHO",
                ].map((col, i) => (
                  <th key={i} className="px-4 py-3 font-bold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          {/* Scroll vertical aquí */}
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full table-fixed text-xl text-center">
              <tbody>
                {ordenesFiltradas.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "#f0f9ff",
                    }}
                    className="border-b border-gray-300 transition duration-200 hover:shadow-md"
                  >
                    <td className="px-4 py-3">{row.ORDEN}</td>
                    <td className="px-4 py-3">{row.PRIORIDAD}</td>
                    <td className="px-4 py-3">{row.DESTINO}</td>
                    <td className="px-4 py-3">{row.PRESENTACION}</td>
                    <td className="px-4 py-3">{row.EJEC_PROY}</td>
                    <td className="px-4 py-3">
                      {formatearFecha(row.F_DESPACHO)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TablaOrdenesArandano;
