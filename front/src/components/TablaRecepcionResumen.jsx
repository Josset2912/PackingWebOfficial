import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Lineas from "./LineChartDual"; // Asegúrate de que este componente exista
import { ResponsiveContainer } from "recharts";
import NumeroUnico from "./NumeroUnico"; // Asegúrate de que este componente exista
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
import {
  fetchCultivos,
  fetchSedes,
  fetchEmpaqFiltro,
  fetchVariedadFiltro,
} from "../utils/api";

const TablaRecepcion = () => {
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
  const [dataCalidadRango, setDataCalidadRango] = useState([]);
  const [dataCalidad, setDataCalidad] = useState([]);
  const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);

  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [dataPorcentaje, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  const [dataLineaTnTotal, setDataLineaTnTotal] = useState([]);
  const colores = {};
  const coloresBase = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#ffbb78",
    "#98df8a",
  ];
  const tiposFiler = Array.isArray(dataCalidadRangoFiler)
    ? [
        ...new Set(
          dataCalidadRangoFiler.map((row) => row.filer?.trim().toUpperCase())
        ),
      ]
    : [];

  const dataAgrupadaFiler = [];

  dataCalidadRangoFiler.forEach(({ rangofiler, filer, avance }) => {
    const tipo = filer?.trim().toUpperCase();
    if (!rangofiler || !tipo) return;
    let existente = dataAgrupadaFiler.find(
      (item) => item.rangofiler === rangofiler
    );
    if (!existente) {
      existente = { rangofiler };
      dataAgrupadaFiler.push(existente);
    }
    existente[tipo] = avance;
  });
  dataAgrupadaFiler.forEach((item) => {
    tiposFiler.forEach((tipo) => {
      if (!(tipo in item)) {
        item[tipo] = 0;
      }
    });
  });

  const tiposPeso = Array.isArray(dataCalidadRango)
    ? [
        ...new Set(
          dataCalidadRango.map((row) => row.tipO_PESO?.trim().toUpperCase())
        ),
      ]
    : [];

  // Agrupar los datos por rango y tipo de peso
  const dataAgrupada = [];

  dataCalidadRango.forEach(({ rango, tipO_PESO, porcentajetotal }) => {
    const tipo = tipO_PESO?.trim().toUpperCase();
    if (!rango || !tipo) return;
    let existente = dataAgrupada.find((item) => item.rango === rango);
    if (!existente) {
      existente = { rango };
      dataAgrupada.push(existente);
    }
    existente[tipo] = porcentajetotal;
  });
  dataAgrupada.forEach((item) => {
    tiposPeso.forEach((tipo) => {
      if (!(tipo in item)) {
        item[tipo] = 0;
      }
    });
  });

  const selectSx = {
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
  };

  const FiltroSelect = ({ id, label, value, options, onChange }) => (
    <div className="w-full sm:w-auto">
      <Box sx={{ minWidth: 190, width: "100%" }}>
        <FormControl fullWidth size="small" sx={selectSx}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            value={value}
            label={label}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
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
      const [resSede, resCultivo, resEmpaque, resVariedad] = await Promise.all([
        fetchSedes(),
        fetchCultivos(),
        fetchEmpaqFiltro(),
        fetchVariedadFiltro(),
      ]);
      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataEmpaqueFiltro(
        Array.isArray(resEmpaque.data) ? resEmpaque.data : []
      );
      setDataVariedadfiltro(
        Array.isArray(resVariedad.data) ? resVariedad.data : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
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
    <div className="">
      {/* Selectores de filtro */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full">
        <div className="mb-0.5 flex flex-wrap  justify-end items-center gap-3">
          {/* SEDE */}
          <FiltroSelect
            id="sede"
            label="SEDE"
            value={dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"}
            options={["TODOS", ...dataSedes.map((r) => r.sede)]}
            onChange={setSede}
          />

          {/* CULTIVO */}
          <FiltroSelect
            id="cultivo"
            label="CULTIVO"
            value={
              dataCultivo.some((row) => row.cultivo === fruta) ? fruta : ""
            }
            options={dataCultivo.map((r) => r.cultivo)}
            onChange={setFruta}
          />

          {/* MAQUINA */}
          <FiltroSelect
            id="empaque"
            label="EMPAQUE"
            value={
              dataEmpaqueFiltro.some((row) => row.empaque === empaqueFiltro)
                ? empaqueFiltro
                : ""
            }
            options={dataEmpaqueFiltro.map((r) => r.empaque)}
            onChange={setEmpaqueFiltro}
          />

          {/* TURNO */}
          <FiltroSelect
            id="variedad"
            label="VARIEDAD"
            value={
              dataVariedadfiltro.some((row) => row.variedad === variedadFiltro)
                ? variedadFiltro
                : ""
            }
            options={dataVariedadfiltro.map((r) => r.variedad)}
            onChange={setVariedadfiltro}
          />

          {/* FECHA */}
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
      </div>
      {/* TABLAS Y LINEAS*/}

      {/*MEDIDOR Y NÚMEROS UNICOS */}
      <div className="">
        {/* Contenedor flex horizontal */}
        <div className="mb-4">
          {/* Contenedor flex responsive */}
          <div className="flex flex-wrap gap-4 justify-evenly items-start">
            {/* Medidor */}
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/5 max-w-full bg-white rounded-lg shadow-md flex flex-col items-center mx-auto">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center sm:text-left uppercase">
                Porcentaje cumplimiento
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
                fontSize="24px"
                thickness="65%"
              />
            </div>

            {/* TN PROMEDIO 1 */}
            <div className="w-full sm:min-w-[220px] sm:w-auto bg-white p-4 rounded-lg shadow-md flex flex-col items-center mx-auto">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center sm:text-left uppercase">
                kg programado
              </h4>
              <NumeroUnico value={dataLineaTnTotal?.[0]?.tnTotal || 0} />
            </div>

            {/* TN PROMEDIO 2 */}
            <div className="w-full sm:min-w-[220px] sm:w-auto bg-white p-4 rounded-lg shadow-md flex flex-col items-center mx-auto">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center sm:text-left uppercase">
                kg ejecutado
              </h4>
              <NumeroUnico value={dataLineaTnTotal?.[0]?.tnTotal || 0} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* TABLA VARIEDAD - IZQUIERDA */}
        <div className="lg:w-1/2 w-full overflow-x-auto rounded-xl shadow-lg ">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[200px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    VAR
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    KG PROG
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    KG EJEC
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    % CUMP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataCalidad.length > 0 ? (
                  dataCalidad.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.linea}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.presentacion || ""}
                      </td>
                      <td
                        className={`px-2 py-2 text-center text-sm sm:text-2xl font-medium ${
                          row.tipO_PESO === "BAJO PESO"
                            ? "text-red-500"
                            : row.tipO_PESO === "SOBRE PESO"
                            ? "text-yellow-500"
                            : "text-gray-800"
                        }`}
                      >
                        {row.tipO_PESO || "--"}
                      </td>
                      <td
                        className={`px-2 py-2 text-center text-sm sm:text-2xl font-medium ${
                          row.porcentaje >= 5 && row.porcentaje < 7
                            ? "text-green-500"
                            : row.porcentaje >= 7 && row.porcentaje < 10
                            ? "text-yellow-500"
                            : row.porcentaje >= 10
                            ? "text-red-500"
                            : "text-gray-800"
                        }`}
                      >
                        {row.porcentaje != null ? `${row.porcentaje} %` : "--"}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.cantidad || "--"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
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

        {/* TABLA LINEA - DERECHA */}
        <div className="lg:w-1/2 w-full rounded-xl shadow-lg bg-white h-[300px] sm:h-[400px] lg:h-[50%]">
          <div className="bg-blue-500 rounded-t-xl">
            <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-1 uppercase text-white">
              Porcentaje por rango de hora
            </h2>
          </div>
          <div className="h-[calc(100%-40px)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dataAgrupada}
                margin={{ top: 19, right: 19, left: -35, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis dataKey="rango" />
                <YAxis tick={false} />
                <Tooltip formatter={(value) => `${value} %`} />
                <Legend />
                {tiposPeso.map((tipo) => (
                  <Line
                    key={tipo}
                    type="monotone"
                    dataKey={tipo}
                    stroke={colores[tipo] || "#000"}
                    dot={true}
                    label={({ x, y, value }) => (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#000"
                        fontSize={10}
                        textAnchor="middle"
                      >
                        {`${value} %`}
                      </text>
                    )}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaRecepcion;
