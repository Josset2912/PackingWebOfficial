import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  fetchCultivos,
  fetchSedes,
  fetchEsperaGasificado,
  fetchEsperaBatchGasificado,
  fetchEsperaPreFrio,
  fetchBatchPreFrio,
} from "../utils/api";

const TablaGasificado = () => {
  const [dataGasificado, setDataGasificado] = useState([]);
  const [dataGasificadoBatch, setDataGasificadoBatch] = useState([]);
  const [dataFrio, setDataFrio] = useState([]);
  const [dataFrioBatch, setDataFrioBatch] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [dataSedes, setDataSede] = useState([]);
  const [sede, setSede] = useState("FUNDO SANTA AZUL");

  const [error] = useState(null);

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;

      // Llamadas paralelas
      const [
        resGasificado,
        resGasificadoBatch,
        resPreFrio,
        resFrioBatch,
        resSede,
        resCultivo,
      ] = await Promise.all([
        fetchEsperaGasificado(sedeParam, frutaLower),
        fetchEsperaBatchGasificado(sedeParam, frutaLower),
        fetchEsperaPreFrio(sedeParam, frutaLower),
        fetchBatchPreFrio(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataGasificado(
        Array.isArray(resGasificado.data) ? resGasificado.data : []
      );
      setDataGasificadoBatch(
        Array.isArray(resGasificadoBatch.data) ? resGasificadoBatch.data : []
      );
      setDataFrio(Array.isArray(resPreFrio.data) ? resPreFrio.data : []);
      setDataFrioBatch(
        Array.isArray(resFrioBatch.data) ? resFrioBatch.data : []
      );
      setDataSede(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataGasificado([]);
      setDataGasificadoBatch([]);
      setDataFrio([]);
      setDataFrioBatch([]);
      setDataSede([]);
      setDataCultivo([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sede, fruta]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervaloId);
  }, [sede, fruta]);

  return (
    <div className="p-4">
      {/* Selector de cultivo - Ajuste completo para todos los tamaños */}
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
                  dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"
                }
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
      {/* Espacio entre filtros y tablas */}

      {/* Grid principal - Ajuste responsivo completo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        {/*Gasificado */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/*tabla Gasificado */}
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(60vh-70px)]">
            {/* Título */}
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                ESPERA GASIFICADO
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 ">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead className="sticky top-0 z-10 bg-indigo-600 shadow-md">
                  <tr className="text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALET
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      ESPERA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataGasificado.length > 0 ? (
                    dataGasificado.map((row, index) => (
                      <tr
                        key={`gasificado-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.palet || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700 font-bold">
                          {row.espera ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-center text-gray-500 text-sm sm:text-base italic"
                      >
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla Gasificado Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(40vh-35px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                BATCH GASIFICADO
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                {/* ✅ Sticky header con fondo y sombra para que no se pierda al hacer scroll */}
                <thead className="sticky top-0 z-10 bg-indigo-600 text-white shadow-md">
                  <tr className="text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      BATCH
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALETS
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataGasificadoBatch.length > 0 ? (
                    dataGasificadoBatch.map((row, index) => (
                      <tr
                        key={`gasificado-batch-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.batch || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.palets ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700 font-bold">
                          {row.time ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-gray-500 text-sm sm:text-base italic"
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

        {/* Espacio entre tablas Gasificado y Frío */}

        {/* Espera Pre Frío */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(60vh-70px)] ">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                ESPERA PRE FRÍO
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                {/* ✅ Cabecera sticky con fondo y sombra */}
                <thead className="sticky top-0 z-10 bg-teal-600 text-white shadow-md">
                  <tr className="bg-teal-600 text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALET
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      ESPERA
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataFrio.length > 0 ? (
                    dataFrio.map((row, index) => (
                      <tr
                        key={`frio-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.palet || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.espera ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.total ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-gray-500 text-sm sm:text-base italic"
                      >
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla Pre Frío Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[calc(40vh-35px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                BATCH PRE FRIO
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                {/* ✅ Cabecera sticky con fondo y sombra */}
                <thead className="sticky top-0 z-10 bg-teal-600 text-white shadow-md">
                  <tr className="bg-teal-600 text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      BATCH
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALETS
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataFrioBatch.length > 0 ? (
                    dataFrioBatch.map((row, index) => (
                      <tr
                        key={`frio-batch-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.batch || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.palets ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-bold">
                          {row.time ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-gray-500 text-sm sm:text-base italic"
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
      </div>
    </div>
  );
};

export default TablaGasificado;
