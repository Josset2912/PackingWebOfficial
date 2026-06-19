import React, { useState, useEffect } from "react";
import GaugeChart from "../medit/Medidor";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ResponsiveContainer } from "recharts";
import NumeroUnico from "../medit/NumeroUnico";
import { useTheme } from "../contexts/ThemeContext";
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
    fetchEsperaLineaTnTotal,
} from "../utils/api"; // Asegúrate de que estas funciones estén definidas en utils/api.js
//insertando nuevas tablas
const TablaLineaVolcado = () => {
    const { isDarkMode } = useTheme();

    /* ----------------------- estados de filtros ----------------------- */
    const [maquina, setMaquina] = useState("SELECCIONE");
    const [dataMaquina, setDataMaquina] = useState([]);

    const [fruta, setFruta] = useState("ARANDANO");
    const [dataCultivo, setDataCultivo] = useState([]);

    const [sede, setSede] = useState("FUNDO SANTA AZUL");
    const [dataSedes, setDataSedes] = useState([]);

    const [turno, setTurno] = useState("SELECCIONE");
    const [dataTurno, setDataTurno] = useState([]);

    const [fecha, setFecha] = useState(() =>
        new Date().toLocaleDateString("en-CA")
    );

    /* ----------------------- estados ----------------------- */
    const [dataLineaTnTotal, setDataLineaTnTotal] = useState([]);


    const [dataLineaVolcado, setDataLineaVolcado] = useState([]);

    const [dataSgtePalet, setDataSgtePalet] = useState([]);

    const [, setDataPorcentaje] = useState([]);

    const [progressValue, setProgressValue] = useState(0);

    const [dataLineaRango, setDataLineaRango] = useState([]);

    const selectSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#f3f4f6" : "#000000",
            "& fieldset": {
                borderColor: isDarkMode ? "#4ade80" : "#4caf50",
            },
            "&:hover fieldset": {
                borderColor: isDarkMode ? "#22c55e" : "#388e3c",
            },
            "&.Mui-focused fieldset": {
                borderColor: isDarkMode ? "#10b981" : "#2e7d32",
            },
        },
        "& .MuiInputLabel-root": {
            color: isDarkMode ? "#9ca3af" : "#666666",
            "&.Mui-focused": {
                color: isDarkMode ? "#10b981" : "#2e7d32",
            },
        },
        "& .MuiSelect-icon": {
            color: isDarkMode ? "#9ca3af" : "#666666",
        },
        "& .MuiMenuItem-root": {
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#f3f4f6" : "#000000",
            "&:hover": {
                backgroundColor: isDarkMode ? "#374151" : "#f5f5f5",
            },
        },
    };

    const FiltroSelect = ({ id, label, value, options, onChange }) => (
        <div className="w-full sm:w-auto">
            <Box sx={{ minWidth: 190, width: "100%" }}>
                <FormControl fullWidth size="small" sx={selectSx}>
                    <InputLabel id={`${id}-label`}>{label}</InputLabel>
                    <Select
                        labelId={`${id}-label`}
                        id={id}
                        value={value}
                        label={label}
                        onChange={(e) => onChange(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    bgcolor: isDarkMode ? "#1f2937" : "#ffffff",
                                    "& .MuiMenuItem-root": {
                                        color: isDarkMode ? "#f3f4f6" : "#000000",
                                        "&:hover": {
                                            backgroundColor: isDarkMode ? "#374151" : "#f5f5f5",
                                        },
                                        "&.Mui-selected": {
                                            backgroundColor: isDarkMode ? "#4ade80" : "#4caf50",
                                            color: isDarkMode ? "#000000" : "#ffffff",
                                            "&:hover": {
                                                backgroundColor: isDarkMode ? "#22c55e" : "#388e3c",
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        {options.map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );

    // Obtener los tipos de peso únicos de dataCalidadRango
    const tiposPesos = Array.isArray(dataLineaRango)
        ? [
            ...new Set(
                dataLineaRango.map((row) => row.maquina?.trim().toUpperCase())
            ),
        ]
        : [];

    //Linea TN TOTAL
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

    // Agrupar los datos por rango y tipo de peso
    const dataAgrupadas = [];

    dataLineaRango.forEach(({ maquina, rango, avance }) => {
        const tipo = maquina?.trim().toUpperCase();
        if (!rango || !tipo) return;
        let existente = dataAgrupadas.find((item) => item.rango === rango);
        if (!existente) {
            existente = { rango };
            dataAgrupadas.push(existente);
        }
        existente[tipo] = avance;
    });
    dataAgrupadas.forEach((item) => {
        tiposPesos.forEach((tipo) => {
            if (!(tipo in item)) {
                item[tipo] = 0;
            }
        });
    });
    tiposPesos.forEach((maquina, index) => {
        colores[maquina] = coloresBase[index % coloresBase.length];
    });

    const fetchData = async (hideProgress = false) => {
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
                resLineaTnTotal,
                resSedes,
                resCultivo,
                resMaquina,
                resTurno,
            ] = await Promise.all([
                fetchEsperaLineaProg(
                    fecha,
                    sedeParam,
                    frutaLower,
                    turno,
                    maquinaParam,
                    hideProgress
                ),
                fetchEsperaLineaSgtePalet(
                    fecha,
                    sedeParam,
                    frutaLower,
                    turno,
                    maquinaParam,
                    hideProgress
                ),
                fetchEsperaLineaPorcentaje(
                    fecha,
                    sedeParam,
                    frutaLower,
                    turno,
                    maquinaParam,
                    hideProgress
                ),
                fetchEsperaLineaRatio(
                    fecha,
                    sedeParam,
                    frutaLower,
                    turno,
                    maquinaParam,
                    hideProgress
                ),
                fetchEsperaLineaTnTotal(
                    fecha,
                    sedeParam,
                    frutaLower,
                    turno,
                    maquinaParam,
                    hideProgress
                ),
                fetchSedes(hideProgress),
                fetchCultivos(hideProgress),
                fetchMaquina(frutaLower, hideProgress),
                fetchTurno(hideProgress),
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
            setDataLineaTnTotal(
                Array.isArray(resLineaTnTotal.data) ? resLineaTnTotal.data : []
            );
            setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
            setDataTurno(Array.isArray(resTurno.data) ? resTurno.data : []);
            setDataSedes(Array.isArray(resSedes.data) ? resSedes.data : []);
            setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);

            const pct = parseFloat(
                resLineaVolcadoPorcentaje.data?.[0]?.porcentajetotal
            );
            setProgressValue(!isNaN(pct) ? pct : 0);
            // Calcular el total de TN por hora
            // Asegurarse de que resLineaTnTotal.data sea un array y tenga al menos un elemento
            const tnTotal = parseFloat(resLineaTnTotal.data?.[0]?.tnhoratotal);
            setDataLineaTnTotal((prev) => [
                {
                    ...prev[0],
                    tnTotal: !isNaN(tnTotal) ? tnTotal : 0,
                },
            ]);
        } catch (err) {
            console.error("Error fetching data:", err);

            setDataLineaVolcado([]);
            setDataSgtePalet([]);
            setDataPorcentaje([]);
            setDataLineaRango([]);
            setDataLineaTnTotal([]);
            setDataMaquina([]);
            setDataSedes([]);
            setDataCultivo([]);
        }
    };
    useEffect(() => {
        fetchData(); // Llamada inicial

        const intervaloId = setInterval(() => {
            fetchData(true); // Actualización cada 10 segundos sin progress bar
            //cambiado 60000 a 1 minuto
        }, 60000);

        return () => clearInterval(intervaloId); // Limpieza del intervalo
    }, [fecha, sede, fruta, turno, maquina]);

    //
    return (
        <div className="p-1">
            <div className="mb-0.5 flex flex-wrap  justify-end items-center gap-3">
                {/* SEDE */}
                <FiltroSelect
                    id="sede"
                    label="SEDE"
                    value={dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"}
                    options={["TODOS", ...dataSedes.map((r) => r.sede)]}
                    onChange={setSede}
                />

                {/* CULTIVO */}
                <FiltroSelect
                    id="cultivo"
                    label="CULTIVO"
                    value={dataCultivo.some((row) => row.cultivo === fruta) ? fruta : ""}
                    options={dataCultivo.map((r) => r.cultivo)}
                    onChange={setFruta}
                />

                {/* MAQUINA */}
                <FiltroSelect
                    id="maquina"
                    label="MAQUINA"
                    value={
                        dataMaquina.some((row) => row.maquina === maquina) ? maquina : ""
                    }
                    options={dataMaquina.map((r) => r.maquina)}
                    onChange={setMaquina}
                />

                {/* TURNO */}
                <FiltroSelect
                    id="turno"
                    label="TURNO"
                    value={dataTurno.some((row) => row.turno === turno) ? turno : ""}
                    options={dataTurno.map((r) => r.turno)}
                    onChange={setTurno}
                />

                {/* FECHA */}
                <div className="w-full sm:w-auto">
                    <Box sx={{ minWidth: 190, width: "100%" }}>
                        <FormControl fullWidth size="small" sx={selectSx}>
                            <InputLabel shrink htmlFor="fecha-input">
                                FECHA
                            </InputLabel>
                            <input
                                id="fecha-input"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                className="date-input-dark"
                                style={{
                                    width: "100%",
                                    padding: "8.5px 14px",
                                    borderRadius: "8px",
                                    border: isDarkMode
                                        ? "1px solid #4ade80"
                                        : "1px solid #4caf50",
                                    background: isDarkMode ? "#1f2937" : "#ffffff",
                                    color: isDarkMode ? "#e5e7eb" : "#000000",
                                    fontSize: "16px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease",
                                    cursor: "pointer",
                                    colorScheme: isDarkMode ? "dark" : "light",
                                }}
                            />
                        </FormControl>
                    </Box>
                </div>
            </div>
            {/* Tabla kg proy vs ejec y sgte palet */}
            <div className="flex flex-col lg:flex-row gap-3 w-full  overflow-x-auto">
                <div className="flex flex-col  flex-1 min-w-0 min-h-0">
                    {/* Tabla Línea Avance */}{" "}
                    {/* <div className="flex-1 min-w-0 min-h-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden flex flex-col max-sm:rounded-lg">
            <div className="px-6 py-1 max-sm:px-3 max-sm:py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider max-sm:text-sm">
                KG PROG VS EJEC
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="h-auto max-h-[75vh] overflow-y-auto max-sm:max-h-[300px]">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-indigo-600 text-white">
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        EMPAQUE
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        VAR
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        KG PROG
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        EJEC
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
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
                            index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-indigo-50"
                          } hover:bg-indigo-100`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.empaque || ""}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.var || ""}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.prog || "0"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.ejec || "0"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.porcentaje || "0"} %
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic max-sm:text-xs max-sm:py-2"
                        >
                          Ningún dato disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden flex flex-col 
  h-[22vh] md:h-[55vh] sm:h-[60vh]  
  shadow-lg align-middle justify-between border-1 border-gray-400 dark:border-gray-600 transition-colors duration-200 "
                    >
                        {/* Encabezado */}
                        <div className="px-6 py-1 max-sm:px-3 max-sm:py-1">
                            <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider max-sm:text-sm">
                                KG PROG VS EJEC
                            </h2>
                        </div>

                        {/* Contenedor con scroll */}
                        <div className="overflow-y-auto flex-1 min-h-0 ">
                            <table className="w-full min-w-[260px] border-collapse">
                                {/* Encabezados sticky */}
                                <thead className="sticky top-0 z-10 bg-indigo-600 text-white">
                                    <tr>
                                        <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                            EMPAQUE
                                        </th>
                                        <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                            VAR
                                        </th>
                                        <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                            KG PROG
                                        </th>
                                        <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                            EJEC
                                        </th>
                                        <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                            %
                                        </th>
                                    </tr>
                                </thead>

                                {/* Cuerpo */}
                                <tbody className="divide-y divide-gray-200">
                                    {Array.isArray(dataLineaVolcado) &&
                                        dataLineaVolcado.length > 0 ? (
                                        dataLineaVolcado.map((row, index) => (
                                            <tr
                                                key={`lineaAvance-${index}`}
                                                className={`transition-colors duration-200 ${index % 2 === 0
                                                    ? "bg-white dark:bg-gray-900"
                                                    : "bg-indigo-50 dark:bg-gray-800"
                                                    } hover:bg-indigo-100 dark:hover:bg-gray-600`}
                                            >
                                                <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                                    {row.empaque || ""}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                                    {row.var || ""}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                                    {row.prog || "0"}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                                    {row.ejec || "0"}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700 dark:text-gray-300 max-sm:text-xs max-sm:px-2 max-sm:py-1">
                                                    {row.porcentaje || "0"} %
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 italic max-sm:text-xs max-sm:py-2"
                                            >
                                                Ningún dato disponible
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* GRÁFICO DE LÍNEA   <div className=" overflow-x-auto rounded-xl mt-5 h-[300px] sm:h-[400px]"></div> */}
                    <div
                        className="overflow-x-auto rounded-xl mt-5 border shadow-lg transition-colors duration-200
            border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900"
                    >
                        <div className="p-1 bg-blue-500 dark:bg-blue-600 rounded-t-xl transition-colors duration-200">
                            <h2 className="text-center text-lg sm:text-2xl font-bold mb-1 uppercase text-white">
                                AVANCE TN POR HORA
                            </h2>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart
                                data={dataAgrupadas}
                                margin={{ top: 20, right: 22, left: -35, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                                />
                                <XAxis
                                    dataKey="rango"
                                    stroke={isDarkMode ? "#9ca3af" : "#666666"}
                                    tick={{ fill: isDarkMode ? "#d1d5db" : "#333333" }}
                                />
                                <YAxis
                                    tick={false}
                                    stroke={isDarkMode ? "#9ca3af" : "#666666"}
                                />
                                <Tooltip
                                    formatter={(value) => `${value} `}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        background: isDarkMode ? "#1f2937dd" : "#ffffffdd",
                                        backdropFilter: "blur(4px)",
                                        border: `1px solid ${isDarkMode ? "#4b5563" : "#dddddd"}`,
                                        color: isDarkMode ? "#f3f4f6" : "#000000",
                                    }}
                                    labelStyle={{
                                        color: isDarkMode ? "#f3f4f6" : "#000000",
                                    }}
                                />
                                <Legend
                                    align="center"
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    wrapperStyle={{
                                        textAlign: "center",
                                        width: "100%",
                                        left: 0,
                                        color: isDarkMode ? "#d1d5db" : "#333333",
                                    }}
                                />{" "}
                                {tiposPesos.map((tipo) => (
                                    <Line
                                        key={tipo}
                                        type="linear"
                                        dataKey={tipo}
                                        stroke={colores[tipo] || "#000000"}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: colores[tipo] }}
                                        activeDot={{ r: 6, fill: colores[tipo] }}
                                        animationDuration={500}
                                        label={({ x, y, value }) => (
                                            <text
                                                x={x}
                                                y={y - 10}
                                                fill={isDarkMode ? "#f3f4f6" : colores[tipo]}
                                                fontSize={12}
                                                fontWeight="bold"
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
                {/* Contenedor derecho */}
                <div className="flex flex-col gap-1 min-w-0 min-h-0 max-sm:w-full max-sm:gap-2">
                    {/* Tabla SGTE PALET */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-sm:rounded-lg transition-colors duration-200 border-2 border-gray-300 dark:border-gray-700">
                        <div className="px-12 py-1">
                            <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider">
                                SGTE PALET
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="h-auto max-h-[75vh] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-teal-600 dark:bg-teal-700 text-white transition-colors duration-200">
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
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {dataSgtePalet.length > 0 ? (
                                            dataSgtePalet.map((row, index) => (
                                                <tr
                                                    key={`proximoPalet-${index}`}
                                                    className={`transition-colors duration-200 ${index === 0 ? "animate-blink" : ""
                                                        }`}
                                                >
                                                    <td
                                                        className={`px-4 py-2 text-center text-sm sm:text-3xl font-medium ${index === 0
                                                            ? "text-green-700 dark:text-teal-200"
                                                            : "text-gray-800 dark:text-gray-200"
                                                            }`}
                                                    >
                                                        {row.palet || "N/A"}
                                                    </td>
                                                    <td
                                                        className={`px-4 py-2 text-center text-sm sm:text-3xl font-medium ${index === 0
                                                            ? "text-green-700 dark:text-teal-300"
                                                            : "text-gray-800 dark:text-gray-200"
                                                            }`}
                                                    >
                                                        {row.varsgt || "N/A"}
                                                    </td>
                                                    <td
                                                        className={`px-4 py-2 text-center text-sm sm:text-3xl font-medium ${index === 0
                                                            ? "text-green-700 dark:text-teal-300"
                                                            : "text-gray-800 dark:text-gray-200"
                                                            }`}
                                                    >
                                                        {row.cabsgt || "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="px-4 py-3 text-center text-sm sm:text-base text-red-500 dark:text-red-400 italic"
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

                    {/* Medidor */}
                    <div className="flex justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-colors duration-200">
                        <div className="w-full max-w-[300px] border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4">
                            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 dark:text-gray-200">
                                porcentaje avance
                            </h4>
                            <GaugeChart
                                value={progressValue}
                                colors={{
                                    progress: progressValue > 80 ? "#4CAF50" : "#FFC107",
                                    remaining: isDarkMode ? "#374151" : "#F5F5F5",
                                    needle: "#E91E63",
                                    text: progressValue > 80 ? "#4CAF50" : "#FFC107",
                                    labelColor: isDarkMode ? "#9ca3af" : "#757575",
                                }}
                                label="Progress"
                                fontSize="24px"
                                thickness="65%"
                            />
                        </div>
                    </div>

                    {/* TN PROMEDIO */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center p-4 transition-colors duration-200 border-2 border-gray-300 dark:border-gray-700">
                        <h4 className="uppercase text-3xl text-center font-bold text-gray-800 dark:text-gray-200">
                            AVANCE HR <br /> ACUMULADO
                        </h4>
                        <NumeroUnico
                            value={dataLineaTnTotal?.[0]?.tnTotal || 0}
                            color={isDarkMode ? "#3b82f6" : "#007BFF"}
                            duration={3} // Duración en segundos
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaLineaVolcado;
