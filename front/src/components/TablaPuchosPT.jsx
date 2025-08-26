import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { fetchCultivos, fetchSedes, fetchPuchosPT } from "../utils/api";

const TablaPuchosPT = () => {
  // Estado para fruta y sede

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSede] = useState("TODOS");
  const [dataSedes, setDataSedes] = useState([]);
  const [dataPuchos, setDataPuchos] = useState([]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;

      const [resSede, resCultivo, resPuchos] = await Promise.all([
        fetchSedes(),
        fetchCultivos(),
        fetchPuchosPT(sedeParam, frutaLower),
      ]);

      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data

      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataPuchos(Array.isArray(resPuchos.data) ? resPuchos.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataSedes([]);
      setDataCultivo([]);
      setDataPuchos([]);
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
    <div className="P-4 dark:text-gray-100">
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

      {/* Tabla y contenido */}
      {/* Tabla y contenido */}
      <div className="overflow-x-auto rounded-xl  gap-2 max-sm:mt-1">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] max-sm:max-h-[calc(844px-200px)]">
          <table className="w-full min-w-[300px] border-collapse overflow-x-auto ">
            <thead className="sticky top-0 z-10 bg-blue-600 text-white">
              <tr className="bg-blue-600 text-white  ">
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">ORDEN</span>
                  <span className="hidden max-sm:inline">OR</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">CODIGO PALET</span>
                  <span className="hidden max-sm:inline">COP</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">CODIGO SALDO</span>
                  <span className="hidden max-sm:inline">CAS</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">PRESENTACION</span>
                  <span className="hidden max-sm:inline">PRE</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">VARIEDAD</span>
                  <span className="hidden max-sm:inline">VAR</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">CAJAS</span>
                  <span className="hidden max-sm:inline">CAJAS</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">EQUIVALENCIA</span>
                  <span className="hidden max-sm:inline">EQUI</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(() => {
                const totalRow = dataPuchos.find(
                  (row) => row.empaque?.toLowerCase() === "total"
                );
                const otherRows = dataPuchos.filter(
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
                        className={`hover:bg-gray-50 transition-colors ${
                          isTotalRow
                            ? "font-bold text-blue-900 border-t-4 border-blue-400"
                            : "border-b-1 border-cyan-600 "
                        }`}
                      >
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.orden || ""}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.codigopalet || ""}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.codigosaldo || ""}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.presentacion || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.variedad || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.cajas || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium max-sm:text-xs max-sm:px-1 max-sm:py-1">
                          {row.equivalencia || "--"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-sm sm:text-base text-gray-500 max-sm:text-xs max-sm:py-3"
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

export default TablaPuchosPT;
