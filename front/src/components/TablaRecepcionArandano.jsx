import React, { useState, useEffect } from "react";
import {
  fetchCultivos,
  fetchSedes,
  fetchVariedad,
  fetchCabezal,
} from "../utils/api";

const TablaRecepcionArandano = () => {
  // Estados para filtros
  const [fruta, setFruta] = useState("ARANDANO");
  const [sede, setSede] = useState("TODOS");

  // Datos obtenidos de APIs
  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  const [dataVariedad, setDataVariedad] = useState([]);
  const [dataCabezal, setDataCabezal] = useState([]);

  const [, setLoading] = useState(false);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      setLoading(true);

      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;

      // Llamadas paralelas
      const [resVariedad, resCabezal, resSede, resCultivo] = await Promise.all([
        fetchVariedad(sedeParam, frutaLower),
        fetchCabezal(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
      ]);
        // Verificar si las respuestas son válidas y asignar los datos

      // Las respuestas de axios ya traen el objeto data
      setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
      setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataVariedad([]);
      setDataCabezal([]);
      setDataSedes([]);
      setDataCultivo([]);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchData cuando cambie fruta o sede
  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sede]);

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
      {/* Selectores de filtro */}
      <div className="mb-2 flex flex-wrap gap-2 justify-center sm:justify-end items-center">
        {/* SEDE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:min-w-[160px] sm:w-auto">
          <label className="font-bold text-sm sm:text-lg">SEDE:</label>
          <select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataSedes.map((row, idx) => (
              <option key={idx} value={row.sede}>
                {row.sede}
              </option>
            ))}
          </select>
        </div>

        {/* CULTIVO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:min-w-[160px] sm:w-auto">
          <label className="font-bold text-sm sm:text-lg">CULTIVO:</label>
          <select
            value={fruta}
            onChange={(e) => setFruta(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataCultivo.map((row, idx) => (
              <option key={idx} value={row.cultivo}>
                {row.cultivo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full px-2">
        {/* Tabla Variedad */}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
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
                {dataVariedad.length > 0 ? (
                  dataVariedad.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                        {row.var}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                        {row.ejec || "--"} Kg
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

        {/* Tabla cabezal */}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                    CABEZAL
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                    EJECUTADO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataCabezal.length > 0 ? (
                  dataCabezal.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                        {row.cabezal || "VACÍO"}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                        {row.ejec || "--"} Kg
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
    </div>
  );
};

export default TablaRecepcionArandano;
