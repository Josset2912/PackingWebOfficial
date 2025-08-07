import React, { useState, useEffect } from "react";
import { fetchOrdenes, fetchSedes, fetchCultivos } from "../utils/api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const TablaOrdenesArandano = () => {
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
    <div className="">
      {/* Selector de cultivo y sede */}
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

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead className="sticky top-0 z-10 bg-teal-600 text-white">
              <tr>
                {[
                  "ORDEN",
                  "PRIORIDAD",
                  "DESTINO",
                  "PRESENTACIÓN",
                  "EJEC. PROY",
                  "F. DESPACHO",
                ].map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-sm sm:text-3xl font-semibold uppercase tracking-wider text-center"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataOrdenPRD.length > 0 ? (
                dataOrdenPRD.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-cyan-50`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.orden}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.prioridad}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.destino}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.presentacion}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.ejec_proy}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.f_despacho}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic"
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
  );
};

export default TablaOrdenesArandano;
