import React, { useState, useEffect } from "react";
import { fetchCultivos, fetchSedes, fetchEspera } from "../utils/api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const TablaEspera = () => {
  const [fruta, setFruta] = useState("ARANDANO");
  const [sedes, setSedes] = useState("FUNDO SANTA AZUL");

  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  const [dataEsperaVolcado, setDataEsperaVolcado] = useState([]);

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sedes === "TODOS" ? "" : sedes;

      // Llamadas paralelas
      const [resEspera, resSede, resCultivo] = await Promise.all([
        fetchEspera(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
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
      fetchData();
    }, 10000);

    return () => clearInterval(intervaloId);
  }, [fruta, sedes]);

  return (
    <div className="">
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
      <div className="overflow-x-auto rounded-xl ">
        <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
          <table className="w-full min-w-[300px] border-collapse border border-gray-400">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                <th className="px-4 py-2 text-center font-semibold text-base sm:text-4xl uppercase tracking-wider">
                  PALET
                </th>
                <th className="px-4 py-2 text-center font-semibold text-base sm:text-4xl uppercase tracking-wider">
                  ESPERA
                </th>
                <th className="px-4 py-2 text-center font-semibold text-base sm:text-4xl uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {dataEsperaVolcado.length > 0 ? (
                dataEsperaVolcado.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b  transition duration-200 ${
                      index % 2 === 0 ? "" : ""
                    } hover:bg-cyan-50`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl  font-medium">
                      {row.palet}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl  font-medium">
                      {row.espera}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-3xl ">
                      {row.total}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-center text-sm sm:text-base  italic"
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

export default TablaEspera;
