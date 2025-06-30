// TablaEsperaArandano.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TablaEsperaArandano = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cultivo, setCultivo] = useState("ARANDANO");

  // Lista de frutas disponibles
  const frutas = ["ARANDANO", "UVA"];

  const cargarDatos = async (tipo) => {
    try {
      setLoading(true);
      setError(null);
        const response = await axios.get(
          `http://10.250.200.9:8650/api/esperaVolcadoAran?Cod=''&Turno=''&Cultivo=${tipo}`
          /* `http://10.51.51.15:8650/api/esperaVolcadoAran?Cod=''&Turno=''&Cultivo=${tipo}` */
        );
      setData(response.data || []);
    } catch (err) {
      setError("Error al obtener los datos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos(cultivo);
  }, [cultivo]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      cargarDatos(cultivo);
    }, 10000);

    return () => clearInterval(intervaloId);
  }, [cultivo]);

  //const cantidadEnEspera = data.filter((row) => row.ESPERA > 0).length;

  if (loading) {
    return (
      <div className="container mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mx-auto"></div>
        <p className="mt-4 text-cyan-700">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center py-8">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Selector de cultivo arriba de la tabla */}
      <div className="mb-1 flex items-center justify-between flex-wrap gap-4 ">
        <h2 className="font-bold text-xl md:text-3xl text-black uppercase tracking-wider flex items-center gap-2">
          ESPERA VOLCADO
          <span className="text-black-600 text-xl md:text-4xl font-normal"></span>
        </h2>

        <div className="flex items-center gap-2">
          <label className="font-bold text-lg">CULTIVO:</label>
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
      </div>

      {/* Tabla */}
      <div className="mb-1"></div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-130px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                  PALET
                </th>
                <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                  ESPERA
                </th>
                <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-cyan-50`}
                  >
                    <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                      {row.PALET}
                    </td>
                    <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                      {row.ESPERA}
                    </td>
                    <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                      {row.TOTAL}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-center text-gray-500 italic"
                  >
                    Ningún dato disponible
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

export default TablaEsperaArandano;
