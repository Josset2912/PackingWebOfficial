import { useState, useEffect } from "react";

const TablaRecepcionCultivo = () => {
  const [cultivo, setCultivo] = useState("ARANDANO"); // Estado para el cultivo seleccionado
  const [data, setData] = useState([]);

  // Lista de frutas disponibles
  const frutas = ["ARANDANO", "UVA"];

  // Fetch dinámico usando parámetros
  const fetchCultivoData = async (tipo) => {
    try {
      /* const endpoint = `http://10.250.200.9:8650/api/recepcionAran?Cod=''&Camara=''&Cultivo=${tipo}`; */
      const endpoint = `http://10.250.200.9:8650/api/recepcionAran?Cod=''&Camara=''&Cultivo=${tipo}`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchCultivoData(cultivo);
  }, [cultivo]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchCultivoData(cultivo);
    }, 30000);

    return () => clearInterval(intervaloId);
  }, [cultivo]);

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
      {/* Selector de cultivo */}
      <div className="mb-2 flex flex-wrap items-center justify-end">
        <label className="mr-2 font-bold text-sm sm:text-lg">CULTIVO:</label>
        <select
          value={cultivo}
          onChange={(e) => setCultivo(e.target.value)}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
        >
          {frutas.map((fruta) => (
            <option key={fruta} value={fruta}>
              {fruta}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                  VARIEDAD
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                  EJECUCIÓN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                      {row.VAR}
                    </td>
                    <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                      {row.EJEC || "--"} Kg
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-4 py-6 text-center text-sm sm:text-base text-gray-500"
                  >
                    No hay datos de recepción disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaRecepcionCultivo;
