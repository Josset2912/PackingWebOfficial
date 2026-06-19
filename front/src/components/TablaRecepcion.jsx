import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "../contexts/ThemeContext";

import {
    fetchCultivos,
    fetchSedes,
    fetchVariedad,
    fetchCabezal,
    fetchEmpaqFiltro,
    fetchVariedadFiltro,
} from "../utils/api";

const TablaRecepcion = () => {
    const { isDarkMode } = useTheme();

    // Estados para filtros
    const [empaqueFiltro, setEmpaqueFiltro] = useState("TODOS");
    const [dataEmpaqueFiltro, setDataEmpaqueFiltro] = useState([]);

    const [variedadFiltro, setVariedadfiltro] = useState("TODOS");
    const [dataVariedadfiltro, setDataVariedadfiltro] = useState([]);
    
    // Estado para fruta y sede

    const [fruta, setFruta] = useState("ARANDANO");
    const [dataCultivo, setDataCultivo] = useState([]);

    const [sede, setSede] = useState("TODOS");
    const [dataSedes, setDataSedes] = useState([]);

    // Datos obtenidos de APIs
    const [dataVariedad, setDataVariedad] = useState([]);
    const [, setDataCabezal] = useState([]);

    // Función para cargar todos los datos
    const fetchData = async (hideProgress = false) => {
        try {
            // Convertir valores a minúsculas para la API si lo requiere
            const frutaLower = fruta.toLowerCase();
            const sedeParam = sede === "TODOS" ? "" : sede;
            const empaqueParam = empaqueFiltro === "TODOS" ? "" : empaqueFiltro;
            const variedadFiltroParam =
                variedadFiltro === "TODOS" ? "" : variedadFiltro;
            // Llamadas paralelas
            const [
                resVariedad,
                resCabezal,
                resSede,
                resCultivo,
                resEmpaque,
                resVariedadFiltro,
            ] = await Promise.all([
                fetchVariedad(
                    sedeParam,
                    frutaLower,
                    empaqueParam,
                    variedadFiltroParam,
                    hideProgress
                ),
                fetchCabezal(
                    sedeParam,
                    frutaLower,
                    empaqueParam,
                    variedadFiltroParam,
                    hideProgress
                ),
                fetchSedes(hideProgress),
                fetchCultivos(hideProgress),
                fetchEmpaqFiltro(hideProgress),
                fetchVariedadFiltro(hideProgress),
            ]);
            // Verificar si las respuestas son válidas y asignar los datos
            // si no, asignar un array vacío
            setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
            setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
            setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
            setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
            setDataEmpaqueFiltro(
                Array.isArray(resEmpaque.data) ? resEmpaque.data : []
            );
            setDataVariedadfiltro(
                Array.isArray(resVariedadFiltro.data) ? resVariedadFiltro.data : []
            );
        } catch (err) {
            console.error("Error fetching data:", err);
            setDataVariedad([]);
            setDataCabezal([]);
            setDataSedes([]);
            setDataCultivo([]);
            setDataEmpaqueFiltro([]);
            setDataVariedadfiltro([]);
        }
    };

    // Ejecutar fetchData cuando cambie fruta o sede
    useEffect(() => {
        fetchData(); // Llamada inicial - muestra progress bar

        const intervaloId = setInterval(() => {
            fetchData(true); // Actualizaciones automáticas - oculta progress bar
            //cambiado 60000 a 1 minuto
        }, 60000);

        return () => clearInterval(intervaloId); // Limpieza del intervalo
    }, [fruta, sede, empaqueFiltro, variedadFiltro]);

    const FiltroSelect = ({ id, label, value, options, onChange }) => (
        <div className="w-full sm:w-auto">
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

    return (
        <div className="p-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Selectores de filtro */}
            <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full mt-1 p-2">
                {/* SEDE */}
                <FiltroSelect
                    id="sede"
                    label="SEDE"
                    value={sede}
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

                {/* EMPAQUE */}
                <FiltroSelect
                    id="empaque"
                    label="EMPAQUE"
                    value={empaqueFiltro}
                    options={[
                        "TODOS",
                        ...dataEmpaqueFiltro
                            .filter((row) => row.cultivo === fruta)
                            .map((r) => r.empaque),
                    ]}
                    onChange={setEmpaqueFiltro}
                />

                {/* VARIEDAD */}
                <FiltroSelect
                    id="variedad"
                    label="VARIEDAD"
                    value={variedadFiltro}
                    options={[
                        "TODOS",
                        ...dataVariedadfiltro
                            .filter((row) => row.cultivo === fruta)
                            .map((r) => r.variedad),
                    ]}
                    onChange={setVariedadfiltro}
                />
            </div>

            {/* Tabla y contenido */}
            <div className="overflow-x-auto rounded-xl gap-2 max-sm:mt-1">
                <div className="overflow-y-auto max-h-[calc(100vh-100px)] max-sm:max-h-[calc(844px-200px)]">
                    <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                        <thead className="sticky top-0 z-10 bg-blue-600 text-white dark:bg-blue-800 dark:text-gray-100">
                            <tr>
                                <th className="px-2 py-2 text-center font-bold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                    <span className="max-sm:hidden">EMPAQUE</span>
                                    <span className="hidden max-sm:inline">EMP</span>
                                </th>
                                <th className="px-2 py-2 text-center font-bold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                    <span className="max-sm:hidden">VARIEDAD</span>
                                    <span className="hidden max-sm:inline">VAR</span>
                                </th>
                                <th className="px-2 py-2 text-center font-bold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                    <span className="max-sm:hidden">CABEZAL</span>
                                    <span className="hidden max-sm:inline">CAB</span>
                                </th>
                                <th className="px-2 py-2 text-center font-bold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                    <span className="max-sm:hidden">PESO NETO</span>
                                    <span className="hidden max-sm:inline">PESO</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {(() => {
                                const totalRow = dataVariedad.find(
                                    (row) => row.empaque?.toLowerCase() === "total"
                                );
                                const otherRows = dataVariedad.filter(
                                    (row) => row.empaque?.toLowerCase() !== "total"
                                );
                                const finalRows = [
                                    ...otherRows,
                                    ...(totalRow ? [totalRow] : []),
                                ];

                                return finalRows.length > 0 ? (
                                    finalRows.map((row, index) => {
                                        const isTotalRow = row.empaque?.toLowerCase() === "total";

                                        return (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isTotalRow
                                                    ? "font-bold text-blue-900 dark:text-blue-300 border-t-4 border-blue-400 dark:border-blue-600"
                                                    : "border-b-1 border-cyan-600 dark:border-cyan-400"
                                                    }`}
                                            >
                                                <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-100 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                                    {row.empaque || ""}
                                                </td>
                                                <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-100 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                                    {row.var || ""}
                                                </td>
                                                <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-100 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                                    {row.cabezal || ""}
                                                </td>
                                                <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-100 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1">
                                                    {row.ejec || "--"} kg
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-6 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 max-sm:text-xs max-sm:py-3 font-bold"
                                        >
                                            No hay datos disponibles
                                        </td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TablaRecepcion;
