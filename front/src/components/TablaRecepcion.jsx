import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  fetchCultivos,
  fetchSedes,
  fetchVariedad,
  fetchCabezal,
  fetchEmpaqFiltro,
  fetchVariedadFiltro,
} from "../utils/api";

const TablaRecepcion = ({ darkMode }) => {
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
  const fetchData = async () => {
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
        fetchVariedad(sedeParam, frutaLower, empaqueParam, variedadFiltroParam),
        fetchCabezal(sedeParam, frutaLower, empaqueParam, variedadFiltroParam),
        fetchSedes(),
        fetchCultivos(),
        fetchEmpaqFiltro(),
        fetchVariedadFiltro(),
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
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sede, empaqueFiltro, variedadFiltro]);

  return (
    <div className="p-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Selectores de filtro */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full mt-1 p-2">
        {/* SEDE */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff", // fondo
                  color: darkMode ? "#f9fafb" : "#111827", // texto
                  "& fieldset": {
                    borderColor: darkMode ? "#4b5563" : "green",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#9ca3af" : "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#d1d5db" : "inherit",
                },
                "& .MuiSvgIcon-root": {
                  color: darkMode ? "#f9fafb" : "inherit", // ícono flecha
                },
              }}
            >
              <InputLabel id="sede-select-label">SEDE</InputLabel>
              <Select
                labelId="sede-select-label"
                id="sede-select"
                value={sede}
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
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  color: darkMode ? "#f9fafb" : "#111827",
                  "& fieldset": {
                    borderColor: darkMode ? "#4b5563" : "green",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#9ca3af" : "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#d1d5db" : "inherit",
                },
                "& .MuiSvgIcon-root": {
                  color: darkMode ? "#f9fafb" : "inherit",
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

        {/* EMPAQUE */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  color: darkMode ? "#f9fafb" : "#111827",
                  "& fieldset": {
                    borderColor: darkMode ? "#4b5563" : "green",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#9ca3af" : "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#d1d5db" : "inherit",
                },
                "& .MuiSvgIcon-root": {
                  color: darkMode ? "#f9fafb" : "inherit",
                },
              }}
            >
              <InputLabel id="empaque-select-label">EMPAQUE</InputLabel>
              <Select
                labelId="empaque-select-label"
                id="empaque-select"
                value={empaqueFiltro}
                label="EMPAQUE"
                onChange={(e) => setEmpaqueFiltro(e.target.value)}
              >
                <MenuItem value="TODOS">TODOS</MenuItem>
                {dataEmpaqueFiltro
                  .filter((row) => row.cultivo === fruta)
                  .map((row, idx) => (
                    <MenuItem key={idx} value={row.empaque}>
                      {row.empaque}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* VARIEDAD */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  color: darkMode ? "#f9fafb" : "#111827",
                  "& fieldset": {
                    borderColor: darkMode ? "#4b5563" : "green",
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "#9ca3af" : "darkgreen",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: darkMode ? "#d1d5db" : "inherit",
                },
                "& .MuiSvgIcon-root": {
                  color: darkMode ? "#f9fafb" : "inherit",
                },
              }}
            >
              <InputLabel id="variedad-select-label">VARIEDAD</InputLabel>
              <Select
                labelId="variedad-select-label"
                id="variedad-select"
                value={variedadFiltro}
                label="VARIEDAD"
                onChange={(e) => setVariedadfiltro(e.target.value)}
              >
                <MenuItem value="TODOS">TODOS</MenuItem>
                {dataVariedadfiltro
                  .filter((row) => row.cultivo === fruta)
                  .map((row, idx) => (
                    <MenuItem key={idx} value={row.variedad}>
                      {row.variedad}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>
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
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          isTotalRow
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

{
  /* Tabla cabezal */
}
{
  /*   <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
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
                  {(() => {
                    const totalRow = dataCabezal.find(
                      (row) => row.cabezal?.toLowerCase() === "total"
                    );
                    const otherRows = dataCabezal.filter(
                      (row) => row.cabezal?.toLowerCase() !== "total"
                    );
                    const finalRows = [
                      ...otherRows,
                      ...(totalRow ? [totalRow] : []),
                    ];

                    return finalRows.length > 0 ? (
                      finalRows.map((row, index) => {
                        const isTotalRow =
                          row.cabezal?.toLowerCase() === "total";

                        return (
                          <tr
                            key={index}
                            className={`hover:bg-gray-50 transition-colors ${
                              isTotalRow
                                ? " font-bold text-blue-900 border-t-4 border-blue-400 "
                                : ""
                            }`}
                          >
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                              {row.cabezal || "VACÍO"}
                            </td>
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 dark:text-gray-200 font-medium">
                              {row.ejec || "--"} Kg
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 py-6 text-center text-sm sm:text-base text-gray-500"
                        >
                          No hay datos de recepción disponibles
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div> */
}
