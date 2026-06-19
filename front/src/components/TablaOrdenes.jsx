import React, { useState, useEffect } from "react";
import { fetchOrdenes, fetchSedes, fetchCultivos } from "../utils/api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "../contexts/ThemeContext";
import HoverScrollText from "../animacion/AnimacionText";

const TablaOrdenes = () => {
    const { isDarkMode } = useTheme();
    const [dataOrdenPRD, setDataOrdenPRD] = useState([]);

    const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
    const [dataCultivo, setDataCultivo] = useState([]);

    const [sedes] = useState("FUNDO SANTA AZUL");
    const [, setDataSedes] = useState([]);

    const showCalibres = fruta.toUpperCase() === "UVA"; // solo mostrar para UVA
    const totalColumns = showCalibres ? 23 : 13;

    // Move fetchData outside so it's accessible in both useEffects
    // Función para cargar todos los datos

    const fetchData = async (hideProgress = false) => {
        try {
            // Convertir valores a minúsculas para la API si lo requiere
            const frutaLower = fruta.toLowerCase();
            const sedeParam = sedes === "TODOS" ? "" : sedes;

            // Llamadas paralelas
            const [resOrdenes, resSede, resCultivo] = await Promise.all([
                fetchOrdenes(sedeParam, frutaLower, hideProgress),
                fetchSedes(hideProgress),
                fetchCultivos(hideProgress),
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
        fetchData(); // Llamada inicial - muestra progress bar

        const intervaloId = setInterval(() => {
            fetchData(true); // Actualización automática - oculta progress bar
            //cambiado 60000 a 1 minuto
        }, 60000);

        return () => clearInterval(intervaloId); // Limpieza del intervalo
    }, [fruta, sedes]);

    return (
        <div className="p-3 max-sm:p-2">
            {/* Selector de cultivo y sede */}
            <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full max-sm:gap-2 max-sm:mb-2">
                {/* SEDE */}
                {/*  <div className="w-full sm:w-auto max-sm:w-full">
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
                  dataSedes.some((row) => row.sede === sedes) ? sedes : "TODOS"
                }
                label="SEDE"
                onChange={(e) => setSedes(e.target.value)}
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
        </div> */}

                {/* CULTIVO */}
                <div className="w-full sm:w-auto max-sm:w-full">
                    <Box sx={{ minWidth: 190, width: "100%" }}>
                        <FormControl
                            fullWidth
                            size="small"
                            sx={{
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
                            }}
                        >
                            <InputLabel id="cultivo-select-label">CULTIVO</InputLabel>
                            <Select
                                labelId="cultivo-select-label"
                                id="cultivo-select"
                                value={
                                    dataCultivo.some((row) => row.cultivo === fruta) ? fruta : ""
                                }
                                label="CULTIVO"
                                onChange={(e) => setFruta(e.target.value)}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                                            "& .MuiMenuItem-root": {
                                                color: isDarkMode ? "#f3f4f6" : "#000000",
                                                "&:hover": {
                                                    backgroundColor: isDarkMode ? "#10b981" : "#4caf50",
                                                    color: "#ffffff",
                                                },
                                                "&.Mui-selected": {
                                                    backgroundColor: isDarkMode ? "#059669" : "#388e3c",
                                                    color: "#ffffff",
                                                    "&:hover": {
                                                        backgroundColor: isDarkMode ? "#047857" : "#2e7d32",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                }}
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
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-xl shadow-lg max-sm:rounded-lg max-sm:shadow-md border-2 border-gray-300 dark:border-gray-700">
                <div className="overflow-y-auto max-h-[calc(100vh-100px)] max-sm:max-h-[calc(100vh-120px)] lg:max-h-[calc(100vh-100px)]">
                    <table className="w-full min-w-[600px] sm:min-w-full border-collapse text-sm sm:text-base">
                        <thead className="sticky top-0 z-10 bg-teal-600 text-white">
                            {/* FILA 1 → títulos grandes */}
                            <tr className="bg-gradient-to-r from-cyan-600 to-blue-700">
                                {/* <th
                  rowSpan={2}
                  className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                >
                  EMPRESA
                </th> */}
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    VAR
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    LINEA
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    ORDEN
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    PRIo
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-6 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    DESTINO
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    PRESENTACION
                                </th>

                                {/* 🔹 NUEVO BLOQUE */}
                                {showCalibres && (
                                    <>
                                        <th
                                            colSpan={5}
                                            className="py-1 px-2 text-center font-bold text-xs sm:text-xl uppercase cursor-default bg-cyan-700"
                                        >
                                            STOCK x CALIBRES
                                        </th>
                                        <th
                                            colSpan={5}
                                            className="py-1 px-2 text-center font-bold text-xs sm:text-xl uppercase cursor-default bg-orange-400"
                                        >
                                            AVANCE x CALIBRES
                                        </th>
                                    </>
                                )}

                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    EJEC/PROY
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    % AVANCE
                                </th>
                                <th
                                    rowSpan={2}
                                    className="py-1 px-2 text-center font-bold text-xs sm:text-2xl uppercase cursor-default"
                                >
                                    F.DESP
                                </th>
                            </tr>

                            {/* FILA 2 → sub columnas */}
                            <tr className="bg-gradient-to-r from-cyan-700 to-blue-800 text-xs sm:text-lg">
                                {/* STOCK / AVANCE x CALIBRES */}
                                {showCalibres && (
                                    <>
                                        {/* STOCK */}
                                        <th className="px-2 py-1">J</th>
                                        <th className="px-2 py-1">JJ</th>
                                        <th className="px-2 py-1">JJJ</th>
                                        <th className="px-2 py-1">JJJJ</th>
                                        <th className="px-2 py-1">JJJJJ</th>

                                        {/* AVANCE */}
                                        <th className="px-2 py-1">J</th>
                                        <th className="px-2 py-1">JJ</th>
                                        <th className="px-2 py-1">JJJ</th>
                                        <th className="px-2 py-1">JJJJ</th>
                                        <th className="px-2 py-1">JJJJJ</th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {dataOrdenPRD.length > 0 ? (
                                dataOrdenPRD.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-50  dark:hover:bg-gray-800
                      
                        ? "font-bold text-black dark:text-white border-t-1 border-blue-400"
                        : "border-b-1 border-cyan-600 "
                    transition-colors `}
                                    >
                                        {/* <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl truncate max-w-[100px] cursor-default">
                      {row.empresa}
                    </td> */}
                                        <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default">
                                            {row.variedad}
                                        </td>
                                        <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default">
                                            {row.linea}
                                        </td>
                                        <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default">
                                            {row.orden}
                                        </td>
                                        <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default">
                                            {row.prioridad}
                                        </td>
                                        {/*  <td className="py-1 text-center font-bold text-xs sm:text-2xl cursor-default max-w-[100px] overflow-hidden">
                      <div className="relative w-full overflow-hidden">
                        <div className="whitespace-nowrap animate-scroll-text">
                          {row.destino}
                        </div>
                      </div>
                    </td>
 */}

                                        {/* implementando animacion por celda  */}
                                        <td className="px-1.5 py-1 text-center font-bold text-xs sm:text-2xl  max-w-[120px] overflow-hidden cursor-default">
                                            <HoverScrollText text={row.destino} />
                                        </td>

                                        <td className="px-1.5 py-1 text-center font-bold text-xs sm:text-2xl  max-w-[120px] overflow-hidden cursor-default">
                                            <HoverScrollText text={row.presentacion} />
                                        </td>

                                        {/* ================= STOCK / AVANCE x CALIBRES ================= */}
                                        {showCalibres && (
                                            <>
                                                {/* STOCK x CALIBRES */}
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.sj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.sjj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.sjjj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.sjjjj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.sjjjjj}
                                                </td>

                                                {/* AVANCE x CALIBRES */}
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.aj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.ajj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.ajjj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.ajjjj}
                                                </td>
                                                <td className="px-1 py-1 text-center text-xs sm:text-xl text-black font-semibold dark:text-white cursor-default">
                                                    {row.ajjjjj}
                                                </td>
                                            </>
                                        )}
                                        <td
                                            className={`px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default ${(parseFloat(row.ejec) || 0) ===
                                                (parseFloat(row.proy) || 0)
                                                ? "text-green-500"
                                                : (parseFloat(row.ejec) || 0) >=
                                                    (parseFloat(row.proy) || 0)
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {row.ejec_Proy}
                                        </td>
                                        {/*  <td
                      className={`px-1 py-1 text-center font-bold text-xs sm:text-2xl ${
                        parseFloat(row.exportable) === 100
                          ? "text-green-500"
                          : parseFloat(row.exportable) >= 60
                          ? "text-orange-300"
                          : "text-red-500"
                      }`}
                    >
                      {row.exportable}%
                    </td> */}
                                        <td
                                            className={`px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default
                            ${parseFloat(row.exportable) >= 100
                                                    ? "text-white bg-green-400"
                                                    : parseFloat(row.exportable) >= 60
                                                        ? "text-white bg-yellow-500"
                                                        : "text-white bg-red-400"
                                                }
                        `}
                                        >
                                            {row.exportable}%
                                        </td>

                                        <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl cursor-default">
                                            {row.f_Despacho}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={totalColumns}
                                        className="px-4 py-6 text-center text-xs sm:text-base text-gray-500 italic justify-center"
                                    >
                                        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                                            <svg
                                                className="w-8 h-8 mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>

                                            <span className="text-sm font-medium">
                                                No se encontraron datos
                                            </span>
                                        </div>
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

export default TablaOrdenes;
