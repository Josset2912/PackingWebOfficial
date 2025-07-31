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
} from "../utils/api";

const TablaRecepcionArandano = () => {
  // Estados para filtros
  const [fruta, setFruta] = useState("ARANDANO");
  const [sede, setSede] = useState("TODOS");

  // Datos obtenidos de APIs
  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  const [dataVariedad, setDataVariedad] = useState([]);
  const [dataCabezal, setDataCabezal] = useState([]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;

      // Llamadas paralelas
      const [resVariedad, resCabezal, resSede, resCultivo] = await Promise.all([
        fetchVariedad(sedeParam, frutaLower),
        fetchCabezal(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
      ]);
      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data
      setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
      setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataVariedad([]);
      setDataCabezal([]);
      setDataSedes([]);
      setDataCultivo([]);
    }
  };

  // Ejecutar fetchData cuando cambie fruta o sede
  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sede]);

  return (
    <div className="">
      {/* Selectores de filtro */}
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
      </div>

      <div className="flex flex-col md:flex-row gap-1 w-full">
        <div className="flex flex-col md:flex-row gap-2 w-full px-2 mt-1">
          {/* Tabla Variedad */}
          <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      VARIEDAD
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      EJECUCIÓN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(() => {
                    const totalRow = dataVariedad.find(
                      (row) => row.var?.toLowerCase() === "total"
                    );
                    const otherRows = dataVariedad.filter(
                      (row) => row.var?.toLowerCase() !== "total"
                    );
                    const finalRows = [
                      ...otherRows,
                      ...(totalRow ? [totalRow] : []),
                    ];

                    return finalRows.length > 0 ? (
                      finalRows.map((row, index) => {
                        const isTotalRow = row.var?.toLowerCase() === "total";

                        return (
                          <tr
                            key={index}
                            className={`hover:bg-gray-50 transition-colors ${
                              isTotalRow
                                ? "font-bold text-blue-900 border-t-4 border-blue-400"
                                : ""
                            }`}
                          >
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                              {row.var}
                            </td>
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
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
          </div>

          {/* Tabla cabezal */}
          <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
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
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                              {row.cabezal || "VACÍO"}
                            </td>
                            <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
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
          </div>
        </div>
      </div>

      {/* Gráfico de barras por rango de filer */}
    </div>
  );
};

export default TablaRecepcionArandano;
