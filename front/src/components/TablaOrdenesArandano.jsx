import React, { useState, useEffect } from "react";
import { fetchOrdenes, fetchSedes, fetchCultivos } from "../utils/api";

const TablaOrdenesArandano = () => {
  const [dataOrdenPRD, setDataOrdenPRD] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sedes, setSedes] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);

  // Move fetchData outside so it's accessible in both useEffects
  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sedes === "TODOS" ? "" : sedes;

      // Llamadas paralelas
      const [resOrdenes, resSede, resCultivo] = await Promise.all([
        fetchOrdenes(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataOrdenPRD(Array.isArray(resOrdenes.data) ? resOrdenes.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataOrdenPRD([]);
      setDataSedes([]);
      setDataCultivo([]);
    }
  };

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sedes]);

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Selector de cultivo y sede */}
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sedes}
            onChange={(e) => setSedes(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataSedes.length > 0 ? (
              dataSedes.map((row, index) => (
                <option key={index} value={row.sede}>
                  {row.sede}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>
        {/* CULTIVO */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            CULTIVO:
          </label>
          <select
            value={fruta}
            onChange={(e) => setFruta(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataCultivo.length > 0 ? (
              dataCultivo.map((row, index) => (
                <option key={index} value={row.cultivo}>
                  {row.cultivo}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead className="sticky top-0 z-10 bg-teal-600 text-white">
              <tr>
                {[
                  "ORDEN",
                  "PRIORIDAD",
                  "DESTINO",
                  "PRESENTACIÓN",
                  "EJEC. PROY",
                  "F. DESPACHO",
                ].map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-sm sm:text-3xl font-semibold uppercase tracking-wider text-center"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataOrdenPRD.length > 0 ? (
                dataOrdenPRD.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-cyan-50`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.orden}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.prioridad}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.destino}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.presentacion}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.ejec_proy}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.f_despacho}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic"
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

export default TablaOrdenesArandano;
