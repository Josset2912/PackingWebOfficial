import React, { useState, useEffect } from "react";
import { fetchOrdenes, fetchSedes, fetchCultivos } from "../utils/api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";


const TablaOrdenes = () => {
  const [dataOrdenPRD, setDataOrdenPRD] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sedes, setSedes] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);

  // Move fetchData outside so it's accessible in both useEffects
  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sedes === "TODOS" ? "" : sedes;

      // Llamadas paralelas
      const [resOrdenes, resSede, resCultivo] = await Promise.all([
        fetchOrdenes(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
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
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sedes]);

  return (
    <div className="p-3 max-sm:p-2">
      {/* Selector de cultivo y sede */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full max-sm:gap-2 max-sm:mb-2">
        {/* SEDE */}
        <div className="w-full sm:w-auto max-sm:w-full">
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
        </div>

        {/* CULTIVO */}
        <div className="w-full sm:w-auto max-sm:w-full">
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

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg max-sm:rounded-lg max-sm:shadow-md">
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] max-sm:max-h-[calc(100vh-160px)] lg:max-h-[calc(100vh-180px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead className="sticky top-0 z-10 bg-teal-600 text-white">
              <tr className="bg-teal-600 text-white  ">
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">ORDEN</span>
                  <span className="hidden max-sm:inline">OR</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">PRIORIDAD</span>
                  <span className="hidden max-sm:inline">PRIO</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">DESTINO</span>
                  <span className="hidden max-sm:inline">DES</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">PRESENTACIÓN</span>
                  <span className="hidden max-sm:inline">PRES</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">EJEC. PROY</span>
                  <span className="hidden max-sm:inline">EJEC</span>
                </th>
                <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                  <span className="max-sm:hidden">F. DESPACHO</span>
                  <span className="hidden max-sm:inline">DESP</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataOrdenPRD.length > 0 ? (
                dataOrdenPRD.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-cyan-50 active:bg-cyan-100`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 font-medium max-sm:px-2 max-sm:py-1 max-sm:text-xs">
                      {row.Orden}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 font-medium max-sm:px-2 max-sm:py-1 max-sm:text-xs">
                      {row.Prioridad}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 truncate max-w-[120px] mx-auto max-sm:px-2 max-sm:py-1 max-sm:text-xs max-sm:max-w-[80px]">
                      {row.Destino}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 truncate max-w-[150px] mx-auto max-sm:px-2 max-sm:py-1 max-sm:text-xs max-sm:max-w-[90px]">
                      {row.Presentacion}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-sm:px-2 max-sm:py-1 max-sm:text-xs">
                      {row.Ejec_Proy}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-sm:px-2 max-sm:py-1 max-sm:text-xs">
                      {row.F_Despacho}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-sm sm:text-base md:text-lg text-gray-500 italic max-sm:px-2 max-sm:py-3 max-sm:text-xs"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>No se encontraron datos</span>
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
//para ipad mini 768x1024
