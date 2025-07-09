import React, { useState, useEffect } from "react";
import LineChartComponent from "./LineChartDual";
import {
  fetchSedes,
  fetchCultivos,
  fetchMaquina,
  fetchFiler,
  fetchCalidad,
} from "../utils/api";

const TablaCalidad = () => {
  const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSedes] = useState("FUNDO SANTA AZUL"); //sede
  const [dataSedes, setDataSedes] = useState([]);

  const [maquina, setMaquina] = useState("TODOS"); //maquina
  const [dataMaquina, setDataMaquina] = useState([]);

  const [linea, setLinea] = useState("UNITEC");
  const [dataLinea, setDataLinea] = useState([]);

  const [dataCalidad, setDataCalidad] = useState([]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const maquinaParam = maquina === "TODOS" ? "" : maquina;
      const lineaParam = linea === "TODOS" ? "" : linea;

      // Llamadas paralelas
      const [resCalidad, resSede, resCultivo, resMaquina, resLinea] =
        await Promise.all([
          fetchCalidad(sedeParam, frutaLower, maquinaParam, lineaParam),
          fetchSedes(),
          fetchCultivos(),
          fetchFiler(),
          fetchMaquina(),
        ]);

      // Las respuestas de axios ya traen el objeto data
      setDataCalidad(Array.isArray(resCalidad.data) ? resCalidad.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataLinea(Array.isArray(resLinea.data) ? resLinea.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataCalidad([]);
      setDataSedes([]);
      setDataCultivo([]);
      setDataMaquina([]);
      setDataLinea([]);
    }
  };
  // Combinar dataCalidadVariedad y dataCalidadCabezal para el gráfico

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [sede, fruta, maquina, linea]);

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
      {/* Selector de cultivo y sede */}
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sede}
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

        {/* LINEA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            LINEA:
          </label>
          <select
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataLinea.length > 0 ? (
              dataLinea.map((row, index) => (
                <option key={index} value={row.linea}>
                  {row.linea}
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
        {/* MAQUINA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            MAQUINA:
          </label>
          <select
            value={maquina}
            onChange={(e) => setMaquina(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataMaquina.map((row, index) => (
              <option key={index} value={row.maquina}>
                {row.maquina}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full px-2">
        {/* Tabla Variedad */}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[300px] border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    LINEA
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    PRESENTACION
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    TIPO PESO
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    PORCENTAJE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataCalidad.length > 0 ? (
                  dataCalidad.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.linea}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.presentacion || ""}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.tipo_peso || "--"} Kg
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.porcentaje || "--"} Kg
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

        {/* <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <LineChartComponent
            data={dataAcumulada}
            label1="variedad Acumulada"
            key1="variedadAcum"
            label2="Cabezal Acumulada"
            key2="cabezalAcum"
          />
        </div> */}
      </div>
    </div>
  );
};
export default TablaCalidad;
