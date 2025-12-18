import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import GaugeChart from "./Medidor";
import NumeroUnico from "./NumeroUnico";
import {
  fetchCultivos,
  fetchPuchosPT,
  fetchEmpresa,
  fetchPuchosPTGrafico,
} from "../utils/api";

const TablaPuchosPT = () => {
  // Estado para fruta y sede

  const [, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  const [dataLineaTnTotal, setDataLineaTnTotal] = useState([]);
  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [empresa, setEmpresa] = useState("TODOS");
  const [dataEmpresa, setDataEmpresa] = useState([]);
  const [fecha, setFecha] = useState(() =>
    new Date().toLocaleDateString("en-CA")
  );

  const selectSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "green" },
      "&:hover fieldset": { borderColor: "darkgreen" },
      "&.Mui-focused fieldset": { borderColor: "green" },
    },
  };
  /*   const [sede, setSede] = useState("TODOS");
  const [dataSedes, setDataSedes] = useState([]); */

  const [dataPuchos, setDataPuchos] = useState([]);

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const empresaParam = empresa === "TODOS" ? "" : empresa;

      const [resEmpresa, resCultivo, resPuchos, resPuchosPTGrafico] =
        await Promise.all([
          fetchEmpresa(),
          fetchCultivos(),
          fetchPuchosPT(fecha, empresaParam, frutaLower),
          fetchPuchosPTGrafico(fecha, empresaParam, frutaLower),
        ]);

      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data

      //NUEVO CODIGO INTEGRADO PARA MEDIDAS
      setDataPorcentaje(
        Array.isArray(resPuchosPTGrafico.data) ? resPuchosPTGrafico.data : []
      );
      const pct = parseFloat(resPuchosPTGrafico.data?.[0]?.exportable);
      setProgressValue(!isNaN(pct) ? pct : 0);
      setDataLineaTnTotal([
        {
          cosechado:
            parseFloat(
              resPuchosPTGrafico.data?.[0]?.cosechado?.replace(/,/g, "")
            ) || 0,
          procesado:
            parseFloat(
              resPuchosPTGrafico.data?.[0]?.procesado?.replace(/,/g, "")
            ) || 0,
        },
      ]);

      setDataEmpresa(Array.isArray(resEmpresa.data) ? resEmpresa.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataPuchos(Array.isArray(resPuchos.data) ? resPuchos.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataEmpresa([]);
      setDataCultivo([]);
      setDataPuchos([]);
    }
  };

  // Ejecutar fetchData cuando cambie fruta, empresa o fecha
  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [fecha, empresa, fruta]);

  return (
    <div className="P-4 dark:text-gray-100">
      {/* FILTROS   */}
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
              <InputLabel id="empresa-select-label">EMPRESA</InputLabel>
              <Select
                labelId="empresa-select-label"
                id="empresa-select"
                value={empresa}
                label="EMPRESA"
                onChange={(e) => setEmpresa(e.target.value)}
              >
                <MenuItem value="TODOS">TODOS</MenuItem>
                {dataEmpresa.map((row, idx) => (
                  <MenuItem key={idx} value={row.empresa}>
                    {row.empresa}
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

        {/*  FECHA  */}
        <div className="w-full sm:w-auto">
          <Box sx={{ minWidth: 190, width: "100%" }}>
            <FormControl fullWidth size="small" sx={selectSx}>
              <InputLabel shrink htmlFor="fecha-input">
                FECHA
              </InputLabel>
              <input
                id="fecha-input"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #4caf50",
                  fontSize: "16px",
                }}
              />
            </FormControl>
          </Box>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_4fr] gap-2">
        <div className="flex flex-col gap-2">
          {/* Medidor */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center">
            <h4 className="text-2xl sm:text-3xl font-bold text-black dark:text-white uppercase tracking-wider text-center mb-2">
              Exportable
            </h4>

            <GaugeChart
              value={progressValue}
              colors={{
                progress: progressValue > 80 ? "#4CAF50" : "#FFC107",
                remaining: "#F5F5F5",
                needle: "#E91E63",
                text: progressValue > 80 ? "#4CAF50" : "#FFC107",
                labelColor: "#757575",
              }}
              label="Progress"
              fontSize="26px"
              thickness="65%"
            />
          </div>
          {/* KG coseschados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="p-4 flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-bold text-black dark:text-white  uppercase tracking-wider">
                  KG cosechados
                </h4>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                  <NumeroUnico value={dataLineaTnTotal?.[0]?.cosechado || 0} />
                </div>
              </div>
              <div className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full">
                En tiempo real
              </div>
            </div>
            <div className="h-20 px-4 pb-3">
              {/* Mini gráfico de tendencia */}
              <div className="h-full flex items-end gap-1">
                {[30, 45, 60, 52, 70, 85, 78].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-colors"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="px-4 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2"></div>
          </div>

          {/* KG PT */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="p-4 flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-bold text-black dark:text-white  uppercase tracking-wider">
                  KG procesados
                </h4>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                  <NumeroUnico value={dataLineaTnTotal?.[0]?.procesado || 0} />
                </div>
              </div>
              <div className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full">
                En tiempo real
              </div>
            </div>
            <div className="h-20 px-4 pb-3">
              {/* Mini gráfico de tendencia */}
              <div className="h-full flex items-end gap-1">
                {[30, 45, 60, 52, 70, 85, 78].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-colors"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="px-4 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2"></div>
          </div>
        </div>

        {/* Tabla y contenido */}
        <div className="overflow-x-auto rounded-xl gap-2 max-sm:mt-1">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)] max-sm:max-h-[calc(844px-200px)]">
            <table className="w-full min-w-[300px] border-collapse overflow-x-auto ">
              <thead className="sticky top-0 z-10 bg-blue-600 text-white">
                <tr className="bg-blue-600 text-white  ">
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">ORDEN</span>
                    <span className="hidden max-sm:inline">OR</span>
                  </th>
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">PRESENTACIÓN</span>
                    <span className="hidden max-sm:inline">PRES</span>
                  </th>
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">VARIEDAD</span>
                    <span className="hidden max-sm:inline">VAR</span>
                  </th>
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">CAJAS</span>
                    <span className="hidden max-sm:inline">CAJ</span>
                  </th>

                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">EQUIVALENCIA</span>
                    <span className="hidden max-sm:inline">EQUI</span>
                  </th>
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">CAJAS TOTAL</span>
                    <span className="hidden max-sm:inline">CAJAST</span>
                  </th>
                  <th className="px-2 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs max-sm:px-1 max-sm:py-1">
                    <span className="max-sm:hidden">CAJAS PENDIENTE</span>
                    <span className="hidden max-sm:inline">CAJASP</span>
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
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            isTotalRow
                              ? "font-bold text-blue-900 border-t-4 border-blue-400"
                              : "border-b-1 border-cyan-600 "
                          }`}
                        >
                          <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.orden || ""}
                          </td>
                          <td className="px-2 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.presentacion || ""}
                          </td>
                          <td className="px-1 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.variedad || ""}
                          </td>
                          <td className="px-1 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.cajas || "--"}
                          </td>
                          <td className="px-1 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.equivalencia || "--"}
                          </td>
                          <td className="px-1 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.cajastotal || "--"}
                          </td>
                          <td className="px-1 py-1 text-center text-sm sm:text-2xl text-gray-800 dark:text-gray-200 font-bold max-sm:text-xs max-sm:px-1 max-sm:py-1 ">
                            {row.cajaspendiente || "--"}
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
    </div>
  );
};

export default TablaPuchosPT;
