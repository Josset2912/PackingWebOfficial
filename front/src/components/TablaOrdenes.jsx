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

  const [sedes] = useState("FUNDO SANTA AZUL");
  const [, setDataSedes] = useState([]);

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
          <table className="w-full min-w-[600px] sm:min-w-full border-collapse text-sm sm:text-base">
            <thead className="sticky top-0 z-10 bg-teal-600 text-white">
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-700">
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">EMPRESA</span>
                  <span className="sm:hidden">EMP</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">ORDEN</span>
                  <span className="sm:hidden">ORDEN</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">PRIORIDAD</span>
                  <span className="sm:hidden">PRIORIDAD</span>
                </th>
                <th className="py-1 px-6 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">DESTINO</span>
                  <span className="sm:hidden">DESTINO</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">PRESENTACION</span>
                  <span className="sm:hidden">PRESENTACION</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">EJEC / PROY</span>
                  <span className="sm:hidden">EJEC / PROY</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">% avance</span>
                  <span className="sm:hidden">%</span>
                </th>
                <th className="py-1 px-2 text-center font-bold text-xs sm:text-3xl uppercase">
                  <span className="max-sm:hidden">F.DESPACHO</span>
                  <span className="sm:hidden">F.DESPACHO</span>
                </th>
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
                    <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl truncate max-w-[100px]">
                      {row.empresa}
                    </td>
                    <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl">
                      {row.orden}
                    </td>
                    <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl">
                      {row.prioridad}
                    </td>
                    <td className=" py-1 text-center font-bold text-xs sm:text-2xl truncate max-w-[90px]">
                      {row.destino}
                    </td>
                    <td className=" py-1 text-center font-bold text-xs sm:text-2xl truncate max-w-[100px]">
                      {row.presentacion}
                    </td>
                    <td
                      className={`px-1 py-1 text-center font-bold text-xs sm:text-2xl ${
                        (parseFloat(row.ejec) || 0) ===
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
                      className={`px-1 py-1 text-center font-bold text-xs sm:text-2xl
                            ${
                              parseFloat(row.exportable) === 100
                                ? "text-white bg-green-400"
                                : parseFloat(row.exportable) >= 60
                                ? "text-white bg-yellow-500"
                                : "text-white bg-red-400"
                            }
                        `}
                    >
                      {row.exportable}%
                    </td>

                    <td className="px-1 py-1 text-center font-bold text-xs sm:text-2xl">
                      {row.f_Despacho}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-xs sm:text-base text-gray-500 italic"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
