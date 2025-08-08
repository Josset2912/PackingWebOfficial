import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  fetchCultivos,
  fetchSedes,
  fetchVariedadNisira,
  fetchCabezalNisira,
  fetchEmpaqFiltro,
  fetchVariedadFiltro,
} from "../utils/api";

const TablaRecepcionNisira = () => {
  const [empaqueFiltro, setEmpaqueFiltro] = useState("TODOS");
  const [dataEmpaqueFiltro, setDataEmpaqueFiltro] = useState([]);

  const [variedadFiltro, setVariedadfiltro] = useState("TODOS");
  const [dataVariedadfiltro, setDataVariedadfiltro] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSede] = useState("TODOS");
  const [dataSedes, setDataSedes] = useState([]);

  const [dataVariedad, setDataVariedad] = useState([]);
  const [dataCabezal, setDataCabezal] = useState([]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const empaqueParam = empaqueFiltro === "TODOS" ? "" : empaqueFiltro;
      const variedadFiltroParam =
        variedadFiltro === "TODOS" ? "" : variedadFiltro;
      // Las respuestas de axios ya traen el objeto data
      const [
        resVariedad,
        resCabezal,
        resSede,
        resCultivo,
        resEmpaqFiltro,
        resVariedadFiltro,
      ] = await Promise.all([
        fetchVariedadNisira(
          sedeParam,
          frutaLower,
          empaqueParam,
          variedadFiltroParam
        ),
        fetchCabezalNisira(
          sedeParam,
          frutaLower,
          empaqueParam,
          variedadFiltroParam
        ),
        fetchSedes(),
        fetchCultivos(),
        fetchEmpaqFiltro(),
        fetchVariedadFiltro(),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
      setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataEmpaqueFiltro(
        Array.isArray(resEmpaqFiltro.data) ? resEmpaqFiltro.data : []
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

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fruta, sede, empaqueFiltro, variedadFiltro]);

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

        {/* EMPAQUE */}
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
                  .filter((row) => row.cultivo === fruta) // ← Asegúrate de que este campo existe
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
                  .filter((row) => row.cultivo === fruta) // ← Asegúrate de que este campo existe
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

      <div className="flex flex-col md:flex-row gap-4 w-full px-2">
        {/* Tabla Variedad */}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
              <thead className="sticky top-0 z-10 bg-blue-600 text-white">
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    EMPAQUE
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    VARIEDAD
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    CABEZAL
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    PESO NETO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
                          className={`hover:bg-gray-50 transition-colors ${
                            isTotalRow
                              ? "font-bold text-blue-900 border-t-4 border-blue-400  border-5  "
                              : ""
                          }`}
                        >
                          <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                            {row.empaque}
                          </td>
                          <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                            {row.var}
                          </td>
                          <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                            {row.cabezal || ""}
                          </td>
                          <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                            {row.pesoneto || "--"} Kg
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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
        {/*<div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    CABEZAL
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    EMPAQUE
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    PESO NETO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataCabezal.length > 0 ? (
                  dataCabezal.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.cabezal || "VACÍO"}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.empaque || ""}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.pesoneto || "--"} Kg
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-6 text-center text-sm sm:text-base text-gray-500"
                    >
                      No hay datos de recepción disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
              </div>
              */}
      </div>
    </div>
  );
};
export default TablaRecepcionNisira;
