import { motion } from "framer-motion";

const TablaOrdenesUva = ({ data }) => {
  const cantidadOrden = data.filter((row) => row.Orden > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col mt-6 pb-12 px-8 lg:px-12"
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          ÓRDENES DE PRODUCCIÓN ({cantidadOrden})
        </h2>
        <span className="text-2xl font-semibold text-gray-600">SEMANA</span>
      </div>

      {/* Tabla con encabezado sticky y scroll en filas */}
      <div className="w-full max-w-screen-2xl mx-auto bg-white rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xl text-center">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-2xl">
              <tr>
                <th className="px-6 py-4 font-bold">ORDEN</th>
                <th className="px-6 py-4 font-bold">PRIORIDAD</th>
                <th className="px-6 py-4 font-bold">DESTINO</th>
                <th className="px-6 py-4 font-bold">PRESENTACIÓN</th>
                <th className="px-6 py-4 font-bold">EJEC/PROY</th>
                <th className="px-6 py-4 font-bold">F. DESPACHO</th>
              </tr>
            </thead>
          </table>

          <div className="w-full max-w-[1800px] mx-auto bg-white rounded-xl shadow-md">
            <table className="w-full table-fixed text-xl text-center">
              <tbody>
                {data.map((row, index) => (
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
                    <td className="px-6 py-4">{row.Orden}</td>
                    <td className="px-6 py-4">{row.Prioridad}</td>
                    <td className="px-6 py-4">{row.Destino}</td>
                    <td className="px-6 py-4">{row.Presentacion}</td>
                    <td className="px-6 py-4">{row.Ejec_proy}</td>
                    <td className="px-6 py-4">
                      {new Date(row.F_Despacho).toLocaleDateString("es-ES")}
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

export default TablaOrdenesUva;
