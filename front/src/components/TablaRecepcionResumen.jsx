import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Lineas from "./LineChartDual";
import { ResponsiveContainer } from "recharts";
import NumeroUnico from "./NumeroUnico";
import { Check, X } from "lucide-react"; // iconos

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
  fetchSedes,
  fetchCultivos,
  fetchEmpaqFiltro,
  fetchVariedadFiltro,
  fetchRecepcionResumen,
  fetchRecepcionVariedad,
  fetchRecepcionRango,
} from "../utils/api";

const TablaRecepcion = () => {
  const [sede, setSede] = useState("TODOS");
  const [dataSedes, setDataSedes] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [empaqueFiltro, setEmpaqueFiltro] = useState("TODOS");
  const [dataEmpaqueFiltro, setDataEmpaqueFiltro] = useState([]);

  const [variedadFiltro, setVariedadfiltro] = useState("TODOS");
  const [dataVariedadfiltro, setDataVariedadfiltro] = useState([]);

  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [dataRecepcionVariedad, setDataRecepcionVariedad] = useState([]);
  const [dataRecepcionRango, setDataRecepcionRango] = useState([]);

  const [, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  const [dataLineaTnTotal, setDataLineaTnTotal] = useState([]);

  const colores = {
    "Peso Neto": "#007bff", // Azul
  };
  // 1️⃣ Procesar datos para la gráfica
  // 1️⃣ Procesar datos para la gráfica
  // 1️⃣ Agrupar por hora y sumar Pesos Netos
  // 1️⃣ Procesar datos para la gráfica
  const tiposPeso = ["Peso Neto"]; // definimos directamente el tipo

  const dataAgrupada = [];
  dataRecepcionRango.forEach(({ hora, pesoneto }) => {
    if (!hora || !pesoneto) return;

    // Convertir "6,895.00" a número 6895.00
    const valorNumerico = parseFloat(pesoneto.replace(/,/g, ""));

    // Buscar si ya existe esa hora
    let existente = dataAgrupada.find((item) => item.hora === hora);
    if (!existente) {
      existente = { hora };
      dataAgrupada.push(existente);
    }

    // Asignar valor al tipo
    existente["Peso Neto"] = valorNumerico;
  });

  // Completar valores faltantes con 0
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
      "& fieldset": { borderColor: "green" },
      "&:hover fieldset": { borderColor: "darkgreen" },
      "&.Mui-focused fieldset": { borderColor: "green" },
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

  const fetchData = async () => {
    try {
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const empaqueParam = empaqueFiltro === "TODOS" ? "" : empaqueFiltro;
      const variedadFiltroParam =
        variedadFiltro === "TODOS" ? "" : variedadFiltro;

      const [
        resSede,
        resCultivo,
        resEmpaque,
        resVariedad,
        resRecepcionResumen,
        resRecepcionVariedad,
        resRecepcionRango,
      ] = await Promise.all([
        fetchSedes(),
        fetchCultivos(),
        fetchEmpaqFiltro(),
        fetchVariedadFiltro(),
        fetchRecepcionResumen(
          sedeParam,
          frutaLower,
          empaqueParam,
          variedadFiltroParam,
          fecha
        ),
        fetchRecepcionVariedad(
          sedeParam,
          frutaLower,
          empaqueParam,
          variedadFiltroParam,
          fecha
        ),
        fetchRecepcionRango(
          sedeParam,
          frutaLower,
          empaqueParam,
          variedadFiltroParam,
          fecha
        ),
      ]);

      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataEmpaqueFiltro(
        Array.isArray(resEmpaque.data) ? resEmpaque.data : []
      );
      setDataVariedadfiltro(
        Array.isArray(resVariedad.data) ? resVariedad.data : []
      );
      setDataPorcentaje(
        Array.isArray(resRecepcionResumen.data) ? resRecepcionResumen.data : []
      );

      const pct = parseFloat(resRecepcionResumen.data?.[0]?.cumplimientototal);
      setProgressValue(!isNaN(pct) ? pct : 0);

      setDataLineaTnTotal([
        {
          kgprogtotal:
            parseFloat(
              resRecepcionResumen.data?.[0]?.kgprogtotal?.replace(/,/g, "")
            ) || 0,
          kgejectotal:
            parseFloat(
              resRecepcionResumen.data?.[0]?.kgejectotal?.replace(/,/g, "")
            ) || 0,
        },
      ]);
      setDataRecepcionVariedad(
        Array.isArray(resRecepcionVariedad.data)
          ? resRecepcionVariedad.data
          : []
      );
      setDataRecepcionRango(
        Array.isArray(resRecepcionRango.data) ? resRecepcionRango.data : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataSedes([]);
      setDataCultivo([]);
      setDataEmpaqueFiltro([]);
      setDataVariedadfiltro([]);
      setDataPorcentaje([]);
      setProgressValue(0);
      setDataLineaTnTotal([]);
      setDataRecepcionVariedad([]);
      setDataRecepcionRango([]);
    }
  };

  useEffect(() => {
    fetchData();
    const intervaloId = setInterval(fetchData, 10000);
    return () => clearInterval(intervaloId);
  }, [sede, fruta, empaqueFiltro, variedadFiltro, fecha]);

  return (
    <div className="p-4">
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

          {/* EMPAQUE */}
          <FiltroSelect
            id="empaque"
            label="EMPAQUE"
            value={
              dataEmpaqueFiltro.some((row) => row.empaque === empaqueFiltro)
                ? empaqueFiltro
                : "TODOS"
            }
            options={["TODOS", ...dataEmpaqueFiltro.map((r) => r.empaque)]}
            onChange={setEmpaqueFiltro}
          />

          {/* TURNO */}
          <FiltroSelect
            id="variedad"
            label="VARIEDAD"
            value={
              dataVariedadfiltro.some((row) => row.variedad === variedadFiltro)
                ? variedadFiltro
                : "TODOS"
            }
            options={["TODOS", ...dataVariedadfiltro.map((r) => r.variedad)]}
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
        <div className="mb-3">
          {/* Contenedor flex responsive */}
          <div className="flex flex-wrap gap-40 justify-center ">
            {/* Medidor */}
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/4 max-w-full bg-white rounded-lg shadow-md flex flex-col items-center ">
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

            {/* KG PROGRAMADO */}
            <div className="inline-block bg-white p-4 rounded-lg shadow-md text-center ">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 uppercase">
                kg programado
              </h4>
              <div className="inline-block">
                <NumeroUnico value={dataLineaTnTotal?.[0]?.kgprogtotal || 0} />
              </div>
            </div>

            {/* KG EJECUTADO */}
            <div className="inline-block bg-white p-4 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 uppercase">
                kg ejecutado
              </h4>
              <div className="inline-block">
                <NumeroUnico value={dataLineaTnTotal?.[0]?.kgejectotal || 0} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* TABLA VARIEDAD - IZQUIERDA */}
        <div className="lg:w-1/2 w-full overflow-x-auto rounded-xl shadow-lg">
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
                {dataRecepcionVariedad.length > 0 ? (
                  dataRecepcionVariedad.map((row, index) => {
                    const cumplimiento = parseFloat(row.cumplimiento) || 0;

                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.variedad || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.kgprog || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.kgejec || "--"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {cumplimiento >= 100 ? "✅" : "❌"}{" "}
                          {cumplimiento.toFixed(2)} %
                        </td>
                      </tr>
                    );
                  })
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
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={dataAgrupada}
                margin={{ top: 19, right: 19, left: -35, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="10 10" opacity={0.1} />
                <XAxis dataKey="hora" />
                <YAxis tick={false} />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} kg`} // <-- aquí
                  contentStyle={{
                    borderRadius: "8px",
                    background: "#ffffffdd",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #dddddd",
                  }}
                />
                <Legend
                  align="center"
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    textAlign: "center",
                    width: "100%",
                    left: 0,
                  }}
                />{" "}
                {tiposPeso.map((tipo) => (
                  <Line
                    key={tipo}
                    type="linear"
                    dataKey={tipo}
                    stroke={colores[tipo] || "#007bff"}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                    label={({ x, y, value }) => (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#000"
                        fontSize={10}
                        textAnchor="middle"
                      >
                        {`${value.toLocaleString()} kg`} {/* <-- aquí */}
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
