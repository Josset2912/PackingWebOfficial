import React, { useState, useEffect } from "react";
import LineChartComponent from "./LineChartDual";
import { ResponsiveContainer } from "recharts";
import GaugeChart from "./Medidor";
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
import {
  fetchSedes,
  fetchCultivos,
  fetchMaquina,
  fetchFiler,
  fetchPresentacion,
  fetchCalidad,
  fetchCalidadRango,
  fetchCalidadRangoFiler,
  fetchCalidadPorcentajeMuestras,
} from "../utils/api";

const TablaCalidad = () => {
  const [fruta, setFruta] = useState("ARANDANO"); // Fruta por defecto
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSedes] = useState("FUNDO SANTA AZUL"); //sede
  const [dataSedes, setDataSedes] = useState([]);

  const [maquina, setMaquina] = useState("SELECCIONE"); //maquina
  const [dataMaquina, setDataMaquina] = useState([]);

  const [filer, setFiler] = useState("SELECCIONE");
  const [dataFiler, setDataFiler] = useState([]);

  const [presentacion, setPresentacion] = useState("SELECCIONE"); //presentacion
  const [dataPresentacion, setDataPresentacion] = useState([]);

  const [fecha, setFecha] = useState(() =>
    new Date().toLocaleDateString("en-CA")
  );
  /* ----------------------- Estados de Calidad ----------------------- */
  const [dataCalidad, setDataCalidad] = useState([]);
  const [dataCalidadRango, setDataCalidadRango] = useState([]);
  const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);
  const [dataCalidadPorcentaje, setDataCalidadPorcentaje] = useState([]);
  const [progressValueBajoPeso, setProgressValueBajoPeso] = useState(0);
  const [progressValuePesoNormal, setProgressValuePesoNormal] = useState(0);
  const [progressValueSobrePeso, setProgressValueSobrePeso] = useState(0);
  //  los tipos de filer
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

  const dataAgrupadaFilerOrdenada = [...dataAgrupadaFiler].sort((a, b) => {
    const getStartHour = (rango) => {
      const [horaInicio] = rango.split("-");
      return parseInt(horaInicio.trim(), 10);
    };

    return getStartHour(a.rangofiler) - getStartHour(b.rangofiler);
  });

  //========================
  // Obtener los tipos de peso únicos de dataCalidadRango
  const tiposPeso = Array.isArray(dataCalidadRango)
    ? [
        ...new Set(
          dataCalidadRango.map((row) => row.tipO_PESO?.trim().toUpperCase())
        ),
      ]
    : [];

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

  //SECCION COLORES
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

  tiposPeso.forEach((tipO_PESO, index) => {
    colores[tipO_PESO] = coloresBase[index % coloresBase.length];
  });

  tiposFiler.forEach((filer, index) => {
    colores[filer] = coloresBase[index % coloresBase.length];
  });
  //====

  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const maquinaParam = maquina === "UNITEC" ? "" : maquina;
      const filerParam = filer === "F1" ? "" : filer;
      const presentacionParam =
        presentacion === "SELECCIONE" ? "" : presentacion;

      // Llamadas paralelas
      const [
        resSede,
        resCultivo,
        resMaquina,
        resFiler,
        resPresentacion,
        resCalidad,

        resCalidadRango,
        resCalidadRangoFiler,
        resCalidadPorcentajeMuestras,
      ] = await Promise.all([
        fetchSedes(),
        fetchCultivos(),
        fetchMaquina(frutaLower),
        fetchFiler(maquinaParam),
        fetchPresentacion(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          fecha
        ),
        fetchCalidad(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam,
          fecha
        ),
        fetchCalidadRango(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam,
          fecha
        ),
        fetchCalidadRangoFiler(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam,
          fecha
        ),
        fetchCalidadPorcentajeMuestras(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam,
          fecha
        ),
      ]);

      // Las respuestas de axios ya traen el objeto data

      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataFiler(Array.isArray(resFiler.data) ? resFiler.data : []);
      setDataPresentacion(
        Array.isArray(resPresentacion.data) ? resPresentacion.data : []
      );
      setDataCalidad(Array.isArray(resCalidad.data) ? resCalidad.data : []);
      setDataCalidadRango(
        Array.isArray(resCalidadRango.data) ? resCalidadRango.data : []
      );
      setDataCalidadRangoFiler(
        Array.isArray(resCalidadRangoFiler.data)
          ? resCalidadRangoFiler.data
          : []
      );
      setDataCalidadPorcentaje(
        Array.isArray(resCalidadPorcentajeMuestras.data)
          ? resCalidadPorcentajeMuestras.data
          : []
      );

      // Definir el criterio para la fila que buscas
      const criterio = "BAJO PESO"; // Cambia esto por el criterio adecuado
      const criterio2 = "PESO NORMAL"; // Cambia esto por el criterio adecuado
      const criterio3 = "SOBRE PESO"; // Cambia esto por el criterio adecuado
      // Filtrar la fila específica
      const filaBajoPeso = resCalidadPorcentajeMuestras.data?.find(
        (fila) => fila.tipopesototal === criterio
      );
      const filaPesoNormal = resCalidadPorcentajeMuestras.data?.find(
        (fila) => fila.tipopesototal === criterio2
      );
      const filaSobrePeso = resCalidadPorcentajeMuestras.data?.find(
        (fila) => fila.tipopesototal === criterio3
      );

      // Verificar que la fila existe y obtener el porcentaje de esa fila
      const pctBajoPeso = filaBajoPeso
        ? parseFloat(filaBajoPeso.tipopesoporcentaje)
        : 0;
      setProgressValueBajoPeso(!isNaN(pctBajoPeso) ? pctBajoPeso : 0);
      const pctPesoNormal = filaPesoNormal
        ? parseFloat(filaPesoNormal.tipopesoporcentaje)
        : 0;
      setProgressValuePesoNormal(!isNaN(pctPesoNormal) ? pctPesoNormal : 0);
      const pctSobrePeso = filaSobrePeso
        ? parseFloat(filaSobrePeso.tipopesoporcentaje)
        : 0;
      setProgressValueSobrePeso(!isNaN(pctSobrePeso) ? pctSobrePeso : 0);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataSedes([]);
      setDataCultivo([]);
      setDataMaquina([]);
      setDataFiler([]);
      setDataPresentacion([]);
      setDataCalidad([]);
      setDataCalidadRango([]);
      setDataCalidadRangoFiler([]);
      setDataCalidadPorcentaje([]);
    }
  };
  // Combinar dataCalidadVariedad y dataCalidadCabezal para el gráfico

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [sede, fruta, maquina, filer, presentacion, fecha]);

  return (
    <div className="p-3 sm:p-2  max-sm:p-2 max-sm:mt-0">
      {/* Selector de cultivo y sede */}
      <div className="mb-0.5 flex flex-wrap gap-3 justify-end items-center max-sm:flex-col max-sm:gap-2 max-sm:items-stretch">
        {/* SEDE */}
        <div className="w-full sm:w-auto max-sm:w-full">
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
                  dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"
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

        {/* MAQUINA */}
        <div className="w-full sm:w-auto max-sm:w-full">
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
              <InputLabel id="maquina-select-label">MAQUINA</InputLabel>
              <Select
                labelId="maquina-select-label"
                id="maquina-select"
                value={
                  dataMaquina.some((row) => row.maquina === maquina)
                    ? maquina
                    : ""
                }
                label="MAQUINA"
                onChange={(e) => setMaquina(e.target.value)}
              >
                {dataMaquina.map((row, idx) => (
                  <MenuItem key={idx} value={row.maquina}>
                    {row.maquina}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* FILER */}
        <div className="w-full sm:w-auto max-sm:w-full">
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
              <InputLabel id="filer-select-label">FILER</InputLabel>
              <Select
                labelId="filer-select-label"
                id="filer-select"
                value={
                  dataFiler.some((row) => row.filer === filer)
                    ? filer
                    : "SELECCIONE"
                }
                label="FILER"
                onChange={(e) => setFiler(e.target.value)}
              >
                {dataFiler.length > 0 ? (
                  dataFiler.map((row, idx) => (
                    <MenuItem key={idx} value={row.filer}>
                      {row.filer}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="SELECCIONE">
                    SELECCIONE
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </div>

        {/* PRESENTACION */}
        <div className="w-full sm:w-auto max-sm:w-full">
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
              <InputLabel id="presentacion-select-label">
                PRESENTACION
              </InputLabel>
              <Select
                labelId="presentacion-select-label"
                id="presentacion-select"
                value={
                  dataPresentacion.some(
                    (row) => row.presentacion === presentacion
                  )
                    ? presentacion
                    : "SELECCIONE"
                }
                label="PRESENTACION"
                onChange={(e) => setPresentacion(e.target.value)}
              >
                {dataPresentacion.length > 0 ? (
                  dataPresentacion.map((row, idx) => (
                    <MenuItem key={idx} value={row.presentacion}>
                      {row.presentacion}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="SELECCIONE">
                    SELECCIONE
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </div>

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

      {/* GRAFICOS */}
      <div className="flex flex-col lg:flex-row gap-4 w-full px-2 max-sm:px-0 max-sm:gap-2">
        {/* TABLA VARIEDAD - IZQUIERDA */}
        <div className="w-full lg:w-1/2 overflow-x-auto rounded-xl shadow-lg mt-2 max-sm:mt-1 max-sm:rounded-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)] max-sm:max-h-[300px]">
            <table className="w-full min-w-[200px] ">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-600 text-white ">
                  <th className="px-1 py-1 textter font-bold text-base sm:text-2xl uppercase max-sm:text-xs ">
                    <span className="max-sm:hidden">LINEA</span>
                    <span className="hidden max-sm:inline">LN</span>
                  </th>
                  <th className="px-1 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs">
                    <span className="max-sm:hidden">PRESENTACIÓN</span>
                    <span className="hidden max-sm:inline">PRES</span>
                  </th>
                  <th className="px-1 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs">
                    <span className="max-sm:hidden">TIPO PESO</span>
                    <span className="hidden max-sm:inline">PESO</span>
                  </th>
                  <th className="px-1 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs">
                    %
                  </th>
                  <th className="px-1 py-1 text-center font-bold text-base sm:text-2xl uppercase max-sm:text-xs">
                    CANT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataCalidad.length > 0 ? (
                  dataCalidad.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors border-b-1 border-cyan-600 "
                    >
                      <td className="px-1 py-1 text-center text-sm sm:text-xl text-gray-800 font-bold max-sm:text-xs">
                        {row.linea}
                      </td>
                      <td className="px-1 py-1 text-center text-sm sm:text-xl text-gray-800 font-bold max-sm:text-xs">
                        {row.presentacion || ""}
                      </td>
                      <td
                        className={`px-1 py-1 text-center text-sm sm:text-xl font-bold max-sm:text-xs ${
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
                        className={`px-1 py-1 text-center text-sm sm:text-xl font-bold max-sm:text-xs ${
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
                      <td className="px-1 py-1 text-center text-sm sm:text-xl text-gray-800 font-bold max-sm:text-xs">
                        {row.cantidad || "--"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-sm sm:text-base text-gray-500 max-sm:text-xs max-sm:py-3"
                    >
                      No hay datos de recepción disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRAFICOS - CENTRO */}
        <div className="w-full lg:w-1/3 flex flex-col gap-1 h-auto lg:h-[calc(100vh-100px)] lg:overflow-hidden max-sm:gap-1 max-sm:h-auto">
          {/* Gráfico 1 */}
          <div className="rounded-xl shadow-lg bg-white h-[300px] sm:h-[400px] lg:h-[50%] max-sm:h-[250px]">
            <div className="bg-blue-500 rounded-t-xl">
              <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-1 uppercase text-white max-sm:text-xs">
                % por rango de hora
              </h2>
            </div>
            <div className="h-[calc(100%-40px)] max-sm:h-[calc(100%-30px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataAgrupada}
                  margin={{ top: 19, right: 19, left: -35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="2 2" />
                  <XAxis dataKey="rango" />
                  <YAxis tick={false} />
                  <Tooltip
                    formatter={(value) => `${value} %`}
                    contentStyle={{
                      borderRadius: "8px",
                      background: "#ffffffdd",
                      backdropFilter: "blur(4px)",
                    }}
                  />{" "}
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
                      stroke={colores[tipo] || "#000"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={500}
                      label={({ x, y, value }) =>
                        value > 0 && (
                          <text
                            x={x}
                            y={y - 10}
                            fill={colores[tipo]}
                            fontSize={10}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {`${value}%`}
                          </text>
                        )
                      }
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2 */}
          <div className="rounded-xl shadow-lg bg-white h-[300px] sm:h-[400px] lg:h-[50%] max-sm:h-[250px]">
            <div className="bg-blue-500 rounded-t-xl">
              <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-1 uppercase text-white max-sm:text-xs">
                % por filer
              </h2>
            </div>
            <div className="h-[calc(100%-40px)] max-sm:h-[calc(100%-30px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataAgrupadaFilerOrdenada}
                  margin={{ top: 19, right: 19, left: -35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="2 2" />
                  <XAxis dataKey="rangofiler" />
                  <YAxis tick={false} />
                  <Tooltip
                    formatter={(value) => `${value} %`}
                    contentStyle={{
                      borderRadius: "8px",
                      background: "#ffffffdd",
                      backdropFilter: "blur(4px)",
                    }}
                  />{" "}
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
                  {tiposFiler.map((tipo) => (
                    <Line
                      key={tipo}
                      type="linear"
                      dataKey={tipo}
                      stroke={colores[tipo] || "#000"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={500}
                      label={({ x, y, value }) => (
                        <text
                          x={x}
                          y={y - 10}
                          fill={colores[tipo]}
                          fontSize={10}
                          fontWeight="bold"
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

        {/* GRAFICOS DERECHA */}
        {/* GRAFICOS DERECHA */}
        <div className="w-full lg:w-1/5 flex flex-col gap-1 h-auto lg:h-[calc(100vh-100px)] lg:overflow-hidden justify-center items-center sm:gap-2 sm:py-2">
          {/* medidor conforme */}
          <div className="w-full flex-1 bg-white rounded-xl shadow-lg flex flex-col justify-center sm:min-w-[120px] sm:h-[200px]">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 sm:text">
              % conforme
            </h4>
            <GaugeChart
              value={progressValuePesoNormal}
              colors={{
                progress: progressValuePesoNormal > 80 ? "#4CAF50" : "#FFC107",
                remaining: "#F5F5F5",
                needle: "#E91E63",
                text: progressValuePesoNormal > 80 ? "#4CAF50" : "#FFC107",
                labelColor: "#757575",
              }}
              label="Progress"
              fontSize="24px"
              thickness="65%"
            />
          </div>

          {/* medidor bajopeso */}
          <div className="w-full flex-1 bg-white rounded-xl shadow-lg flex flex-col justify-center sm:min-w-[120px] sm:h-[200px]">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 sm:text">
              % bajopeso
            </h4>
            <GaugeChart
              value={progressValueBajoPeso}
              colors={{
                progress: progressValueBajoPeso > 80 ? "#4CAF50" : "#FFC107",
                remaining: "#F5F5F5",
                needle: "#E91E63",
                text: progressValueBajoPeso > 80 ? "#4CAF50" : "#FFC107",
                labelColor: "#757575",
              }}
              label="Progress"
              fontSize="24px"
              thickness="65%"
            />
          </div>

          {/* medidor sobrepeso */}
          <div className="w-full flex-1 bg-white rounded-xl shadow-lg flex flex-col justify-center sm:min-w-[120px] sm:h-[200px] ">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 sm:text">
              % sobrepeso
            </h4>
            <GaugeChart
              value={progressValueSobrePeso}
              colors={{
                progress: progressValueSobrePeso > 80 ? "#4CAF50" : "#FFC107",
                remaining: "#F5F5F5",
                needle: "#E91E63",
                text: progressValueSobrePeso > 80 ? "#4CAF50" : "#FFC107",
                labelColor: "#757575",
              }}
              label="Progress"
              fontSize="24px"
              thickness="65%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TablaCalidad;
