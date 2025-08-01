import React, { useState, useEffect } from "react";
import GaugeChart from "./Medidor";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
      <div className="mb-0.5 flex flex-wrap  justify-end items-center gap-3">
        {/* SEDE */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              <InputLabel id="sede-select-label">SEDE</InputLabel>
              <Select
                labelId="sede-select-label"
                id="sede-select"
                value={
                  dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"
                }
                label="SEDE"
                onChange={(e) => setSede(e.target.value)}
              >
                <MenuItem value="TODOS">TODOS</MenuItem>
                {dataSedes.map((row, idx) => (
                  <MenuItem key={idx} value={row.sede}>
                    {row.sede}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* CULTIVO */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              <InputLabel id="cultivo-select-label">CULTIVO</InputLabel>
              <Select
                labelId="cultivo-select-label"
                id="cultivo-select"
                value={
                  dataCultivo.some((row) => row.cultivo === fruta)
                    ? fruta
                    : ""
                }
                label="CULTIVO"
                onChange={(e) => setFruta(e.target.value)}
              >
                {dataCultivo.map((row, idx) => (
                  <MenuItem key={idx} value={row.cultivo}>
                    {row.cultivo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* MAQUINA */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              <InputLabel id="maquina-select-label">MAQUINA</InputLabel>
              <Select
                labelId="maquina-select-label"
                id="maquina-select"
                value={
                  dataMaquina.some((row) => row.maquina === maquina)
                    ? maquina
                    : ""
                }
                label="MAQUINA"
                onChange={(e) => setMaquina(e.target.value)}
              >
                {dataMaquina.map((row, idx) => (
                  <MenuItem key={idx} value={row.maquina}>
                    {row.maquina}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/*TURNO */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              <InputLabel id="turno-select-label">TURNO</InputLabel>
              <Select
                labelId="turno-select-label"
                id="turno-select"
                value={
                  dataTurno.some((row) => row.turno === turno)
                    ? turno
                    : ""
                }
                label="TURNO"
                onChange={(e) => setTurno(e.target.value)}
              >
                {dataTurno.map((row, idx) => (
                  <MenuItem key={idx} value={row.turno}>
                    {row.turno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        {/* FECHA */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            >
              <InputLabel shrink htmlFor="fecha-input">
                FECHA
              </InputLabel>
              <input
                id="fecha-input"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #4caf50",
                  fontSize: "16px",
                }}
              />
            </FormControl>
          </Box>
        </div>
      </div>

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
          </div>{" "}
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
