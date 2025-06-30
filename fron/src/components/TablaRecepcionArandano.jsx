import { useState, useEffect } from "react";

const TablaRecepcionCultivo = () => {
  const [cultivo, setCultivo] = useState("ARANDANO"); // Estado para el cultivo seleccionado
  const [data, setData] = useState([]);

  // Lista de frutas disponibles
  const frutas = ["ARANDANO", "UVA"];

  // Fetch dinámico usando parámetros
  const fetchCultivoData = async (tipo) => {
    try {
      const endpoint = `http://10.250.200.9:8650/api/recepcionAran?Cod=''&Camara=''&Cultivo=${tipo}`;
      /* const endpoint = `http://10.51.51.15:8650/api/recepcionAran?Cod=''&Camara=''&Cultivo=${tipo}`; */
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
    <div className="container mx-auto p-0 max-w-7xl ">
      {/* Selector de cultivo arriba de la tabla */}
      <div className="mb-0.5 not-first:mb-0 flex items-center justify-end">
        <label className="mr-1 font-bold text-lg  align-sub">CULTIVO:</label>
        <select
          value={cultivo}
          onChange={(e) => setCultivo(e.target.value)}
          className="p-1 border border-green-600 text-xl font-bold text-green-800 rounded"
        >
          {frutas.map((fruta) => (
            <option key={fruta} value={fruta}>
              {fruta}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-center font-semibold text-4xl uppercase">
                  VARIEDAD
                </th>
                <th className="px-4 py-2 text-center font-semibold text-4xl uppercase">
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
                    <td className="px-4 py-2 text-center text-3xl text-gray-800 font-medium">
                      {row.VAR}
                    </td>
                    <td className="px-4 py-2 text-center text-3xl text-gray-800 font-medium">
                      {row.EJEC || "--"} Kg
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-8 text-center text-lg text-gray-500"
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
