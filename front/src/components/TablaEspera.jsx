import React, { useState, useEffect } from "react";
import { fetchCultivos, fetchSedes, fetchEspera } from "../utils/api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTheme } from "../contexts/ThemeContext";

const TablaEspera = () => {
  const { isDarkMode } = useTheme();

  const [fruta, setFruta] = useState("ARANDANO");
  const [sedes, setSedes] = useState("FUNDO SANTA AZUL");

  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  const [dataEsperaVolcado, setDataEsperaVolcado] = useState([]);

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async (hideProgress = false) => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sedes === "TODOS" ? "" : sedes;

      // Llamadas paralelas
      const [resEspera, resSede, resCultivo] = await Promise.all([
        fetchEspera(sedeParam, frutaLower, hideProgress),
        fetchSedes(hideProgress),
        fetchCultivos(hideProgress),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataEsperaVolcado(Array.isArray(resEspera.data) ? resEspera.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataEsperaVolcado([]);
      setDataSedes([]);
      setDataCultivo([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fruta, sedes]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchData(true); // Actualización automática - oculta progress bar
      //cambiado a 60000 para 1 minuto
    }, 60000);

    return () => clearInterval(intervaloId);
  }, [fruta, sedes]);

  return (
    <div className="p-3">
      {/* Selector de cultivo y sede */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full">
        {/* SEDE */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 100, width: "100%" }}>
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
                onChange={(e) => setSedes(e.target.value)}
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
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-900 shadow-lg transition-colors duration-200">
        <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
          <table className="w-full min-w-[300px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-700 dark:to-blue-800 text-white transition-colors duration-200">
                <th className="px-4 py-2 text-center font-bold text-base sm:text-4xl uppercase tracking-wider">
                  PALET
                </th>
                <th className="px-4 py-2 text-center font-bold text-base sm:text-4xl uppercase tracking-wider">
                  ESPERA
                </th>
                <th className="px-4 py-2 text-center font-bold text-base sm:text-4xl uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dataEsperaVolcado.length > 0 ? (
                dataEsperaVolcado.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-cyan-50 dark:bg-gray-800"
                    } hover:bg-cyan-100 dark:hover:bg-gray-600`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {row.palet}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {row.espera}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {row.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-3 text-center text-sm sm:text-base italic text-red-500 dark:text-red-400"
                  >
                    Por el momento ningún dato disponible
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

export default TablaEspera;
