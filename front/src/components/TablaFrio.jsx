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
  fetchEsperaFrio,
  fetchEnfriando,
  fetchBatchEnfriando,
} from "../utils/api";

const TablaFrio = () => {
  const { isDarkMode } = useTheme();

  // Estados principales
  const [fruta, setFruta] = useState("ARANDANO");
  const [sedes, setSede] = useState("FUNDO SANTA AZUL");

  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  const [dataFrio, setDataFrio] = useState([]);
  const [dataEnfriando, setDataEnfriando] = useState([]);
  const [dataBatchEnfriando, setDataBatchEnfriando] = useState([]);

  // Función memoizada para obtener los datos (no se recrea en cada render)
  const fetchData = async (hideProgress = false) => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sedes === "TODOS" ? "" : sedes;

      // Llamadas paralelas
      const [
        resSede,
        resCultivo,
        resEsperaFrio,
        resEnfriando,
        resBatchEnfriando,
      ] = await Promise.all([
        fetchSedes(hideProgress),
        fetchCultivos(hideProgress),
        fetchEsperaFrio(sedeParam, frutaLower, hideProgress),
        fetchEnfriando(sedeParam, frutaLower, hideProgress),
        fetchBatchEnfriando(sedeParam, frutaLower, hideProgress),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataFrio(Array.isArray(resEsperaFrio.data) ? resEsperaFrio.data : []);
      setDataEnfriando(
        Array.isArray(resEnfriando.data) ? resEnfriando.data : []
      );
      setDataBatchEnfriando(
        Array.isArray(resBatchEnfriando.data) ? resBatchEnfriando.data : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataSedes([]);
      setDataCultivo([]);
      setDataFrio([]);
      setDataEnfriando([]);
      setDataBatchEnfriando([]);
    }
  };

  // Actualizamos los refs cuando cambian los filtros
  useEffect(() => {
    fetchData();
  }, [fruta, sedes]);

  // Solo se crea una vez el intervalo, y usamos refs para obtener los filtros actuales
  useEffect(() => {
    const intervalo = setInterval(() => {
      fetchData(true); // llamadas cada 10s - oculta progress bar
      //cambiado a 60000 para 1 minuto
    }, 60000);

    return () => clearInterval(intervalo); // limpieza
  }, [fruta, sedes]); // solo una vez al montar

  return (
    <div className="container mx-auto px-2 sm:px-4  mt-3">
      {/* Selectores */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full">
        {/* SEDE */}
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
              <InputLabel id="sede-select-label">SEDE</InputLabel>
              <Select
                labelId="sede-select-label"
                id="sede-select"
                value={
                  dataSedes.some((row) => row.sede === sedes) ? sedes : "TODOS"
                }
                label="SEDE"
                onChange={(e) => setSede(e.target.value)}
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
                value={
                  dataCultivo.some((row) => row.cultivo === fruta) ? fruta : "" // valor seguro mientras carga
                }
                onChange={(e) => setFruta(e.target.value)}
                label="CULTIVO"
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

      {/* Contenido */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2 ">
        {/*ESPERA FRÍO */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/* ---------- Tabla ESPERA FRÍO ---------- */}
          <div className="mb-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(100vh-100px)] transition-colors duration-200">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider">
                ESPERA FRIO
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <table className="w-full min-w-[400px] border-collapse">
                  <thead className="sticky top-0 z-10 shadow-md">
                    <tr className="bg-indigo-600 dark:bg-indigo-700 text-white transition-colors duration-200">
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        PALET
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        ESPERA
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dataFrio.length > 0 ? (
                      dataFrio.map((row, index) => (
                        <tr
                          key={`frio-${index}`}
                          className={`transition-colors duration-200 ${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-indigo-50 dark:bg-gray-800"
                          } hover:bg-indigo-100 dark:hover:bg-gray-600`}
                        >
                          <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                            {row.palet || "N/A"}
                          </td>
                          <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                            {row.espera || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 italic"
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
        </div>

        {/*  ENFRIANDO */}
        <div className="overflow max-h-[calc(100vh-100px)] ">
          {/* ---------- Tabla ENFRIANDO ---------- */}
          <div className="mb-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden  max-h-[calc(60vh-70px)] transition-colors duration-200">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider">
                ENFRIANDO
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <table className="w-full min-w-[500px] border-collapse">
                  <thead className="sticky top-0 z-10 shadow-md">
                    <tr className="bg-teal-600 dark:bg-teal-700 text-white transition-colors duration-200">
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        PALET
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        ENFRIANDO
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        TOTAL
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dataEnfriando.length > 0 ? (
                      dataEnfriando.map((row, index) => (
                        <tr
                          key={`enfriando-${index}`}
                          className={`transition-colors duration-200 ${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-teal-50 dark:bg-gray-800"
                          } hover:bg-teal-100 dark:hover:bg-gray-600`}
                        >
                          <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                            {row.palet || "N/A"}
                          </td>
                          <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                            {row.enfriando || "N/A"}
                          </td>
                          <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                            {row.total || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 italic"
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

          {/* Tabla enfriando Batch */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(40vh-35px)] transition-colors duration-200">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black dark:text-white uppercase tracking-wider">
                BATCH ENFRIANDO
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead className="sticky top-0 z-10 bg-teal-600 dark:bg-teal-700 text-white shadow-md transition-colors duration-200">
                  <tr className="bg-teal-600 dark:bg-teal-700 text-white transition-colors duration-200">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      BATCH
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALETS
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dataBatchEnfriando.length > 0 ? (
                    dataBatchEnfriando.map((row, index) => (
                      <tr
                        key={`frio-batch-${index}`}
                        className={`transition-colors duration-200 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-teal-50 dark:bg-gray-800"
                        } hover:bg-teal-100 dark:hover:bg-gray-600`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                          {row.batch || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                          {row.palets ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 dark:text-gray-200">
                          {row.time ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base italic"
                      >
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/*  */}
      </div>

      {/*  */}
    </div>
  );
};

export default TablaFrio;
