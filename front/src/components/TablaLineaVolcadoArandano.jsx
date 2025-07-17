import React, { useState, useEffect } from "react";
import GaugeChart from "./Medidor";
import LineChartComponent from "./LineChartDual";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  fetchSedes,
  fetchCultivos,
  fetchMaquina,
  fetchTurno,
  fetchEsperaLineaProg,
  fetchEsperaLineaSgtePalet,
  fetchEsperaLineaPorcentaje,
  fetchEsperaLineaRatio,
} from "../utils/api"; // Asegúrate de que estas funciones estén definidas en utils/api.js
//insertando nuevas tablas
const TablaLineaVolcadoArandano = () => {
  /* ----------------------- estados ----------------------- */
  const [dataLineaVolcado, setDataLineaVolcado] = useState([]);
  const [dataSgtePalet, setDataSgtePalet] = useState([]);
  const [dataPorcentaje, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  const [maquina, setMaquina] = useState("SELECCIONE");
  const [dataMaquina, setDataMaquina] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSede] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);

  const [turno, setTurno] = useState("SELECCIONE");
  const [dataTurno, setDataTurno] = useState([]);

  const [dataLineaRango, setDataLineaRango] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  // Obtener los tipos de peso únicos de dataCalidadRango
  const tiposPeso = Array.isArray(dataLineaRango)
    ? [
        ...new Set(
          dataLineaRango.map((row) => row.maquina?.trim().toUpperCase())
        ),
      ]
    : [];
  //  los tipos de filer

  // Agrupar los datos por rango y tipo de peso
  const dataAgrupada = [];

  dataLineaRango.forEach(({ maquina, rango, avance }) => {
    const tipo = maquina?.trim().toUpperCase();
    if (!rango || !tipo) return;
    let existente = dataAgrupada.find((item) => item.rango === rango);
    if (!existente) {
      existente = { rango };
      dataAgrupada.push(existente);
    }
    existente[tipo] = avance;
  });
  dataAgrupada.forEach((item) => {
    tiposPeso.forEach((tipo) => {
      if (!(tipo in item)) {
        item[tipo] = 0;
      }
    });
  });

  const colores = {};

  const coloresBase = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#ffbb78",
    "#98df8a",
  ];

  tiposPeso.forEach((maquina, index) => {
    colores[maquina] = coloresBase[index % coloresBase.length];
  });
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const maquinaParam = maquina === "UNITEC" ? "" : maquina;

      // Llamadas paralelas
      const [
        resLineaVolcadoProg,
        resLineaVolcadoSgtePalet,
        resLineaVolcadoPorcentaje,
        resLineaVolcadoRatio,
        resSedes,
        resCultivo,
        resMaquina,
        resTurno,
      ] = await Promise.all([
        fetchEsperaLineaProg(fecha, sedeParam, frutaLower, turno, maquinaParam),
        fetchEsperaLineaSgtePalet(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchEsperaLineaPorcentaje(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchEsperaLineaRatio(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchSedes(),
        fetchCultivos(),
        fetchMaquina(frutaLower),
        fetchTurno(),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataLineaVolcado(
        Array.isArray(resLineaVolcadoProg.data) ? resLineaVolcadoProg.data : []
      );
      setDataSgtePalet(
        Array.isArray(resLineaVolcadoSgtePalet.data)
          ? resLineaVolcadoSgtePalet.data
          : []
      );
      setDataPorcentaje(
        Array.isArray(resLineaVolcadoPorcentaje.data)
          ? resLineaVolcadoPorcentaje.data
          : []
      );
      setDataLineaRango(
        Array.isArray(resLineaVolcadoRatio.data)
          ? resLineaVolcadoRatio.data
          : []
      );
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataTurno(Array.isArray(resTurno.data) ? resTurno.data : []);
      setDataSedes(Array.isArray(resSedes.data) ? resSedes.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);

      const pct = parseFloat(
        resLineaVolcadoPorcentaje.data?.[0]?.porcentajetotal
      );
      setProgressValue(!isNaN(pct) ? pct : 0);
    } catch (err) {
      console.error("Error fetching data:", err);

      setDataLineaVolcado([]);
      setDataSgtePalet([]);
      setDataPorcentaje([]);
      setDataLineaRango([]);
      setDataMaquina([]);
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
  }, [fecha, sede, fruta, turno, maquina]);

  //
  return (
    <div className="">
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
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
            {dataCultivo.map((row, index) => (
              <option key={index} value={row.cultivo}>
                {row.cultivo}
              </option>
            ))}
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
        {/* TURNO */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            TURNO:
          </label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataTurno.map((row, index) => (
              <option key={index} value={row.turno}>
                {row.turno}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className=" font-bold text-sm sm:text-lg text-nowrap    ">
            FECHA:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-4 text-sm sm:text-xl font-semibold text-red-600 mb-4">
          {error}
        </div>
      )}
      {/* Tabla kg proy vs ejec y sgte palet */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Tabla Línea Avance */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-1">
            <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
              KG PROG VS EJEC
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      VAR
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      PROG
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      EJEC
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataLineaVolcado.length > 0 ? (
                    dataLineaVolcado.map((row, index) => (
                      <tr
                        key={`lineaAvance-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.var || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.prog || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.ejec || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.porcentaje || "0"} %
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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
          {/* GRÁFICO DE LÍNEA */}
          <div className="flex-1 overflow-x-auto rounded-xl shadow-lg mt-5">
            <div className="p-1 bg-blue-500 rounded-t-xl">
              <h2 className="text-center text-lg sm:text-2xl font-bold mb-1 uppercase text-white">
                AVANCE TN POR HORA
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={dataAgrupada}
                margin={{ top: 20, right: 22, left: -35, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis tick={false} />
                <Tooltip formatter={(value) => `${value} `} />
                <Legend />
                {tiposPeso.map((tipo) => (
                  <Line
                    key={tipo}
                    type="monotone"
                    dataKey={tipo}
                    stroke={colores[tipo] || "#000000"}
                    dot={true}
                    label={({ x, y, value }) => (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#000"
                        fontSize={12}
                        textAnchor="middle"
                      >
                        {`${value} `}
                      </text>
                    )}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* Tabla SGTE PALET */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-12 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
                SGTE PALET
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-teal-600 text-white">
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                        PALET
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                        VAR
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                        CAB
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dataSgtePalet.length > 0 ? (
                      dataSgtePalet.map((row, index) => (
                        <tr
                          key={`proximoPalet-${index}`}
                          className={`transition-colors  ${
                            index === 0
                              ? "animate-blink text-green-700"
                              : "border-transparent"
                          }`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-white-800 font-medium">
                            {row.palet || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-white-800 font-medium">
                            {row.varsgt || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-white-800 font-medium">
                            {row.cabsgt || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="1"
                          className="px-4 py-3 text-center text-sm sm:text-base text-red-500 italic"
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

          {/* Ta */}
          <div className="flex flex-col gap-1">
            {/* medidor */}

            <div className="flex justify-center bg-white rounded-xl shadow-lg ">
              <div className="w-full max-w-[300px]">
                <h4 className="uppercase text-2xl text-center font-bold text-gray-800">
                  porcentaje avance
                </h4>
                <GaugeChart
                  value={progressValue}
                  colors={{
                    progress: progressValue > 80 ? "#4CAF50" : "#FFC107",
                    remaining: "#F5F5F5",
                    needle: "#E91E63",
                    text: progressValue > 80 ? "#4CAF50" : "#FFC107",
                    labelColor: "#757575",
                  }}
                  label="Progress"
                  fontSize="24px"
                  thickness="65%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaLineaVolcadoArandano;
