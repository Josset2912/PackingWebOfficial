import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GaugeChart from "./Medidor";
import NumeroUnico from "./NumeroUnico";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import {
  //FILTROS
  fetchSedes,
  fetchCultivos,
  fetchMaquina,
  fetchFiler,
  fetchTurno,
  fetchPresentacion,
  //TABLA CALIDAD
  fetchCalidad,
  fetchCalidadRango,
  fetchCalidadRangoFiler,
  fetchCalidadPorcentajeMuestras,
  //TABLA LINEA VOLCADO
  fetchEsperaLineaProg,
  fetchEsperaLineaSgtePalet,
  fetchEsperaLineaPorcentaje,
  fetchEsperaLineaRatio,
  fetchEsperaLineaTnTotal,
  //TABLA PULMON
} from "../utils/api";

import { fetchTablaPulmon } from "../utils/api";

const TablaNuevo = () => {
  /* ----------------------- filtros ----------------------- */

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSedes] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);

  const [maquina, setMaquina] = useState("SELECCIONE");
  const [dataMaquina, setDataMaquina] = useState([]);

  const [filer, setFiler] = useState("SELECCIONE");
  const [dataFiler, setDataFiler] = useState([]);

  const [turno, setTurno] = useState("SELECCIONE");
  const [dataTurno, setDataTurno] = useState([]);

  const [presentacion, setPresentacion] = useState("SELECCIONE"); //presentacion
  const [dataPresentacion, setDataPresentacion] = useState([]);

  const [fecha, setFecha] = useState(() =>
    new Date().toLocaleDateString("en-CA")
  );

  /* ----------------------- Estados de Calidad ----------------------- */
  const [dataCalidad, setDataCalidad] = useState([]);
  const [dataCalidadRango, setDataCalidadRango] = useState([]);
  const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);
  const [, setDataCalidadPorcentaje] = useState([]);
  const [progressValueBajoPeso, setProgressValueBajoPeso] = useState(0);
  const [progressValuePesoNormal, setProgressValuePesoNormal] = useState(0);
  const [progressValueSobrePeso, setProgressValueSobrePeso] = useState(0);
  /* ----------------------- Estados de Tabla Linea Volcado ----------------------- */
  const [dataLineaTnTotal, setDataLineaTnTotal] = useState([]);
  const [dataLineaVolcado, setDataLineaVolcado] = useState([]);
  const [dataSgtePalet, setDataSgtePalet] = useState([]);
  const [, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [dataLineaRango, setDataLineaRango] = useState([]);

  /* ----------------------- Estados de Tabla  Pulmon ----------------------- */
  const [dataPulmon, setDataPulmon] = useState([]);

  /* ----------------------- Constantes ----------------------- */
  /* ------------------- Constantes Calidad -------------------- */
  const tiposPeso = Array.isArray(dataCalidadRango)
    ? [
        ...new Set(
          dataCalidadRango.map((row) => row.tipO_PESO?.trim().toUpperCase())
        ),
      ]
    : [];

  const tiposFiler = Array.isArray(dataCalidadRangoFiler)
    ? [
        ...new Set(
          dataCalidadRangoFiler.map((row) => row.filer?.trim().toUpperCase())
        ),
      ]
    : [];

  /* ------------------- Constante Linea Volcado -------------------- */
  const tiposPesosLinea = Array.isArray(dataLineaRango)
    ? [
        ...new Set(
          dataLineaRango.map((row) => row.maquina?.trim().toUpperCase())
        ),
      ]
    : [];

  /* ------------------- Constantes Calidad DataAgrupada -------------------- */
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

  /* ------------------- Constantes Calidad dataAgrupadaFiler -------------------- */
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
      if (!(tipo in item)) item[tipo] = 0;
    });
  });

  /* -------------------  Ordenar dataAgrupadaFiler por hora de inicio -------------------- */
  const dataAgrupadaFilerOrdenada = [...dataAgrupadaFiler].sort((a, b) => {
    const getStartHour = (rango) => {
      const [horaInicio] = rango.split("-");
      return parseInt(horaInicio.trim(), 10);
    };

    return getStartHour(a.rangofiler) - getStartHour(b.rangofiler);
  });
  /* ---------------------------------------------------------------------------- */

  const dataAgrupadasLinea = [];
  dataLineaRango.forEach(({ rango, maquina, avance }) => {
    const tipo = maquina?.trim().toUpperCase();
    if (!rango || !tipo) return;
    let existente = dataAgrupadasLinea.find((item) => item.rango === rango);
    if (!existente) {
      existente = { rango };
      dataAgrupadasLinea.push(existente);
    }
    existente[tipo] = avance;
  });
  dataAgrupadasLinea.forEach((item) => {
    tiposPesosLinea.forEach((tipo) => {
      if (!(tipo in item)) item[tipo] = 0;
    });
  });

  // 5. Colores
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

  const colores = {};

  tiposPeso.forEach((tipO_PESO, index) => {
    colores[tipO_PESO] = coloresBase[index % coloresBase.length];
  });
  tiposFiler.forEach((filer, index) => {
    colores[filer] = coloresBase[index % coloresBase.length];
  });
  tiposPesosLinea.forEach(
    (tipo, index) => (colores[tipo] = coloresBase[index % coloresBase.length])
  );

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
      const sedeParam = sede === "TODOS" ? "" : sede;
      const frutaLower = fruta.toLowerCase();
      const maquinaParam = maquina === "UNITEC" ? "" : maquina;
      const filerParam = filer === "SLECCIONE" ? "" : filer;
      const presentacionParam =
        presentacion === "SELECCIONE" ? "" : presentacion;

      // Llamadas paralelas
      const [
        resSede,
        resCultivo,
        resMaquina,
        resFiler,
        resTurno,
        resPresentacion,
        resCalidad,

        resCalidadRango,
        resCalidadRangoFiler,
        resCalidadPorcentajeMuestras,

        resLineaVolcadoProg,
        resLineaVolcadoSgtePalet,
        resLineaVolcadoPorcentaje,
        resLineaVolcadoRatio,
        resLineaTnTotal,

        resPulmon,
      ] = await Promise.all([
        fetchSedes(),
        fetchCultivos(),
        fetchMaquina(frutaLower),
        fetchFiler(maquinaParam),
        fetchTurno(),
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
        fetchEsperaLineaProg(fecha, sedeParam, frutaLower, turno, maquinaParam),
        fetchEsperaLineaSgtePalet(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchEsperaLineaPorcentaje(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchEsperaLineaRatio(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchEsperaLineaTnTotal(
          fecha,
          sedeParam,
          frutaLower,
          turno,
          maquinaParam
        ),
        fetchTablaPulmon(frutaLower, maquinaParam, fecha),
      ]);
      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataFiler(Array.isArray(resFiler.data) ? resFiler.data : []);
      setDataTurno(Array.isArray(resTurno.data) ? resTurno.data : []);
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
      ); // Definir el criterio para la fila que buscas
      setDataLineaVolcado(
        Array.isArray(resLineaVolcadoProg.data) ? resLineaVolcadoProg.data : []
      );
      setDataSgtePalet(
        Array.isArray(resLineaVolcadoSgtePalet.data)
          ? resLineaVolcadoSgtePalet.data
          : []
      );
      setDataPorcentaje(
        Array.isArray(resLineaVolcadoPorcentaje.data)
          ? resLineaVolcadoPorcentaje.data
          : []
      );
      setDataLineaRango(
        Array.isArray(resLineaVolcadoRatio.data)
          ? resLineaVolcadoRatio.data
          : []
      );
      setDataLineaTnTotal(
        Array.isArray(resLineaTnTotal.data) ? resLineaTnTotal.data : []
      );
      setDataPulmon(Array.isArray(resPulmon.data) ? resPulmon.data : []);
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

      const pct = parseFloat(
        resLineaVolcadoPorcentaje.data?.[0]?.porcentajetotal
      );
      setProgressValue(!isNaN(pct) ? pct : 0);
      // Calcular el total de TN por hora
      // Asegurarse de que resLineaTnTotal.data sea un array y tenga al menos un elemento
      const tnTotal = parseFloat(resLineaTnTotal.data?.[0]?.tnhoratotal);
      setDataLineaTnTotal((prev) => [
        {
          ...prev[0],
          tnTotal: !isNaN(tnTotal) ? tnTotal : 0,
        },
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);

      setDataSedes([]);
      setDataCultivo([]);
      setDataMaquina([]);
      setDataFiler([]);
      setDataTurno([]);
      setDataPresentacion([]);
      setDataLineaVolcado([]);
      setDataSgtePalet([]);
      setDataPorcentaje([]);
      setDataLineaRango([]);
      setDataLineaTnTotal([]);
      setDataPulmon([]);
    }
    // Mapeo de encabezados según la máquina
  };

  /* const [filters, setFilters] = useState({
    sede: "TODOS",
    cultivo: "",
    maquina: "",
    filer: "",
    turno: "",
    presentacion: "SELECCIONE",
    fecha: "",
  });
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }; */

  // Ejecutar fetchData cuando cambie fruta o sede
  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [sede, fruta, maquina, filer, turno, presentacion, fecha]);

  return (
    <>
      {/* Selectores de filtro */}
      <div className="mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-end items-stretch sm:items-center w-full mt-1">
        {/* SEDE */}
        <FiltroSelect
          id="sede"
          label="SEDE"
          value={dataSedes.some((row) => row.sede === sede) ? sede : "TODOS"}
          options={["TODOS", ...dataSedes.map((r) => r.sede)]}
          onChange={setSedes}
        />

        {/* CULTIVO */}
        <FiltroSelect
          id="cultivo"
          label="CULTIVO"
          value={dataCultivo.some((row) => row.cultivo === fruta) ? fruta : ""}
          options={dataCultivo.map((r) => r.cultivo)}
          displayEmpty
          onChange={setFruta}
        />

        {/* MAQUINA */}
        <FiltroSelect
          id="maquina"
          label="MAQUINA"
          value={
            dataMaquina.some((row) => row.maquina === maquina) ? maquina : ""
          }
          options={dataMaquina.map((r) => r.maquina)}
          displayEmpty
          onChange={setMaquina}
        />

        {/* FILER */}
        <FiltroSelect
          id="filer"
          label="FILER"
          value={dataFiler.some((row) => row.filer === filer) ? filer : ""}
          options={dataFiler.map((r) => r.filer)}
          displayEmpty
          onChange={setFiler}
        />

        {/* TURNO */}
        <FiltroSelect
          id="turno"
          label="TURNO"
          value={dataTurno.some((row) => row.turno === turno) ? turno : ""}
          options={dataTurno.map((r) => r.turno)}
          displayEmpty
          onChange={setTurno}
        />

        {/* PRESENTACION */}
        <FiltroSelect
          id="presentacion"
          label="PRESENTACIÓN"
          value={
            dataPresentacion.some((row) => row.presentacion === presentacion)
              ? presentacion
              : ""
          }
          options={dataPresentacion.map((r) => r.presentacion)}
          displayEmpty
          onChange={setPresentacion}
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

      <div className=" flex-1 flex flex-col gap-3">
        {/* TABLA LINEA VOLCADO */}
        <div className="flex flex-col lg:flex-row gap-2 w-full h-auto max-sm:h-auto">
          {/* Contenedor izquierdo */}
          <div className="flex flex-col flex-1 gap-3 w-full">
            {/**----------------------------------------------- */}
            {/* Tabla KG PROG VS EJEC */}
            <div className="bg-white rounded-xl shadow-lg flex flex-col w-full max-h-[235px] overflow-hidden">
              {/* Encabezado */}
              <div className="px-4  max-sm:px-2 max-sm:py-1">
                <h2 className="text-center font-bold text-base sm:text-2xl md:text-3xl text-black uppercase tracking-wider max-sm:text-sm">
                  KG PROG VS EJEC
                </h2>
              </div>

              {/* Contenedor con scroll */}
              <div className="overflow-y-auto flex-1 min-h-0 ">
                <table className="w-full min-w-[260px] border-collapse">
                  {/* Encabezados sticky */}
                  <thead className="sticky top-0 z-10 bg-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        EMPAQUE
                      </th>
                      <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        VAR
                      </th>
                      <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        KG PROG
                      </th>
                      <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        EJEC
                      </th>
                      <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase max-sm:text-xs max-sm:px-2 max-sm:py-1">
                        %
                      </th>
                    </tr>
                  </thead>

                  {/* Cuerpo */}
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(dataLineaVolcado) &&
                    dataLineaVolcado.length > 0 ? (
                      dataLineaVolcado.map((row, index) => (
                        <tr
                          key={`lineaAvance-${index}`}
                          className={`transition-colors font-bold text-blue-900 border-t-1.5 border-purple-600 ${
                            index % 2 === 0 ? "bg-white" : ""
                          }`}
                        >
                          <td className="px-4 py-1 text-center text-sm sm:text-2xl text-gray-800 font-bold max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.empaque || ""}
                          </td>
                          <td className="px-4 py-1 text-center text-sm sm:text-2xl text-gray-800 font-bold max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.var || ""}
                          </td>
                          <td className="px-4 py-1 text-center text-sm sm:text-2xl text-gray-700 font-bold max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.prog || "0"}
                          </td>
                          <td className="px-4 py-1 text-center text-sm sm:text-2xl text-gray-700 font-bold max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.ejec || "0"}
                          </td>
                          <td className="px-4 py-1 text-center text-sm sm:text-2xl text-gray-700 font-bold max-sm:text-xs max-sm:px-2 max-sm:py-1">
                            {row.porcentaje || "0"} %
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic max-sm:text-xs max-sm:py-2"
                        >
                          Ningún dato disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico de línea */}
            <div className="rounded-xl border border-gray-400 shadow-lg flex flex-col w-full max-h-[250px] overflow-hidden">
              {/* Cabecera sticky */}
              <div className=" bg-blue-500 rounded-t-xl sticky top-0 z-20">
                <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold uppercase text-white">
                  AVANCE TN POR HORA
                </h2>
              </div>

              {/* Contenedor scroll del gráfico */}
              <div className="overflow-x-auto w-full flex-1">
                <ResponsiveContainer width="100%" height={170}>
                  <LineChart
                    data={dataAgrupadasLinea}
                    margin={{ top: 20, right: 22, left: -35, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rango" />
                    <YAxis tick={false} />
                    <Tooltip
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
                    />
                    {tiposPesosLinea.map((tipo) => (
                      <Line
                        key={tipo}
                        type="linear"
                        dataKey={tipo}
                        stroke={colores[tipo]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={500}
                        label={({ x, y, value }) => (
                          <text
                            x={x}
                            y={y - 10}
                            fill={colores[tipo]}
                            fontSize={12}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {`${value} `}
                          </text>
                        )}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Contenedor derecho */}
          <div className="flex flex-col gap-3 w-full lg:w-[40%]">
            {/* Tabla SGTE PALET */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-">
                <h2 className="text-center font-bold text-base sm:text-2xl md:text-3xl text-black uppercase tracking-wider">
                  SGTE PALET
                </h2>
              </div>

              <div className="overflow-x-auto">
                <div className="h-auto max-h-[75vh] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-teal-600 text-white font-bold">
                        <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase">
                          PALET
                        </th>
                        <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase">
                          VAR
                        </th>
                        <th className="px-4 py- text-center font-bold text-sm sm:text-3xl uppercase">
                          CAB
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-bold">
                      {dataSgtePalet.length > 0 ? (
                        dataSgtePalet.map((row, index) => (
                          <tr
                            key={`proximoPalet-${index}`}
                            className={`transition-colors  ${
                              index === 0
                                ? "animate-blink text-green-700"
                                : "border-transparent"
                            }`}
                          >
                            <td className="px-4 py-1 text-center text-sm sm:text-2xl text-white-800 font-bold">
                              {row.palet || "N/A"}
                            </td>
                            <td className="px-4 py-1 text-center text-sm sm:text-2xl text-white-800 font-bold">
                              {row.varsgt || "N/A"}
                            </td>
                            <td className="px-4 py-1 text-center text-sm sm:text-2xl text-white-800 font-bold">
                              {row.cabsgt || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-center text-sm sm:text-base font-bold text-red-500 italic"
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

            {/* Contenedor principal dividido en dos partes */}
            <div className="flex flex-col lg:flex-row gap-2 w-full">
              {/* Medidor de porcentaje avance */}
              <div className="flex justify-center bg-white rounded-xl shadow-lg flex-1">
                <div className="w-full max-w-[300px]">
                  <h4 className="uppercase text-xl sm:text-2xl text-center font-bold text-gray-800">
                    porcentaje avance
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
              </div>

              {/* TN PROMEDIO / Avance HR Acumulado */}
              <div className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center flex-1 ">
                <h4 className="uppercase text-xl sm:text-2xl text-center font-bold text-gray-800">
                  AVANCE HR ACUMULADO
                </h4>
                <NumeroUnico
                  value={dataLineaTnTotal?.[0]?.tnTotal || 0}
                  color="#007BFF"
                  duration={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== */}
        {/* TABLA CALIDAD */}
        <div className="flex flex-col lg:flex-row gap-2 w-full h-auto max-sm:h-auto  ">
          {/* Contenedor superior: ocupa 50% de la pantalla */}{" "}
          {/* COLUMNA IZQUIERDA - Tabla */}
          <div className="flex flex-col gap-2 w-full max-w-[800px]">
            {/* Primera tabla */}
            <div className="w-full h-[40vh] sm:h-[10vh] min-h-[70px] max-h-[20px] overflow-auto rounded-lg sm:rounded-xl shadow-lg">
              <div className="h-full max-h-full min-w-[300px] w-full">
                <table className="w-full min-w-[300px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-blue-600 text-white">
                      {(() => {
                        const columnasPorMaquina = {
                          UNITEC: ["F1", "F2", "F3", "Pulmon 1", "Pulmon 2"],
                          "DUAL KATO 1": [
                            "F4",
                            "F5",
                            "F6",
                            "Pulmon 1",
                            "Pulmon 2",
                          ],
                          "DUAL KATO 2": [
                            "F7",
                            "F8",
                            "F9",
                            "Pulmon 1",
                            "Pulmon 2",
                          ],
                          "DUAL KATO 3": [
                            "f10",
                            "f11",
                            "f12",
                            "pulmon1",
                            "pulmon2",
                          ],

                          SELECCIONE: [
                            "F1",
                            "F2",
                            "F3",
                            "Pulmon 1",
                            "Pulmon 2",
                          ], // default
                        };
                        const encabezados =
                          columnasPorMaquina[maquina] ||
                          columnasPorMaquina["SELECCIONE"];
                        return encabezados.map((col, index) => (
                          <th
                            key={index}
                            className="px-1 sm:px-2 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap"
                          >
                            <span className="sm:hidden">{col}</span>
                            <span className="hidden sm:inline">{col}</span>
                          </th>
                        ));
                      })()}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {dataPulmon.length > 0 ? (
                      dataPulmon.map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors border-b-1 border-cyan-600"
                        >
                          {(() => {
                            const columnasPorMaquina = {
                              UNITEC: ["f1", "f2", "f3", "pulmon1", "pulmon2"],
                              "DUAL KATO 1": [
                                "f1",
                                "f2",
                                "f3",
                                "pulmon1",
                                "pulmon2",
                              ],
                              "DUAL KATO 2": [
                                "f1",
                                "f2",
                                "f3",
                                "pulmon1",
                                "pulmon2",
                              ],
                              "DUAL KATO 3": [
                                "f1",
                                "f2",
                                "f3",
                                "pulmon1",
                                "pulmon2",
                              ],
                              SELECCIONE: [
                                "f1",
                                "f2",
                                "f3",
                                "pulmon1",
                                "pulmon2",
                              ],
                            };
                            const keys =
                              columnasPorMaquina[maquina] ||
                              columnasPorMaquina["SELECCIONE"];
                            return keys.map((key, i) => (
                              <td
                                key={i}
                                className="px-1 sm:px-2 text-center text-xs sm:text-sm md:text-base lg:text-2xl text-gray-800 font-bold whitespace-nowrap"
                              >
                                {row[key] || ""}
                              </td>
                            ));
                          })()}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-2 sm:px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-500"
                        >
                          No hay datos de recepción disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segunda tabla */}
            <div className="w-full h-[34vh] min-h-[330px] max-h-[500px] overflow-auto rounded-xl shadow-lg max-sm:rounded-lg">
              <div className="h-full max-h-full min-w-[300px] w-full">
                <table className="w-full min-w-[300px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-blue-600 text-white">
                      <th className="px-1 sm:px-2 py-1 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap">
                        <span className="sm:hidden">LN</span>
                        <span className="hidden sm:inline">LINEA</span>
                      </th>
                      <th className="px-1 sm:px-2 py-1 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap">
                        <span className="sm:hidden">PRES</span>
                        <span className="hidden sm:inline">PRESENTACIÓN</span>
                      </th>
                      <th className="px-1 sm:px-2 py-1 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap">
                        <span className="sm:hidden">PESO</span>
                        <span className="hidden sm:inline">TIPO PESO</span>
                      </th>
                      <th className="px-1 sm:px-2 py-1 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap">
                        %
                      </th>
                      <th className="px-1 sm:px-2 py-1 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl uppercase whitespace-nowrap">
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
                          <td className="px- sm:px-1 py-1 text-center text-xs sm:text-sm md:text-base lg:text-2xl text-gray-800 font-bold whitespace-nowrap">
                            {row.linea}
                          </td>
                          <td className="px- sm:px-1 py-1 text-center text-xs sm:text-sm md:text-base lg:text-2xl text-gray-800 font-bold whitespace-nowrap">
                            {row.presentacion || ""}
                          </td>
                          <td
                            className={`px sm:px-1 py-1 text-center text-xs sm:text-sm md:text-base lg:text-2xl font-bold whitespace-nowrap ${
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
                            className={`px- sm:px-1 py-1 text-center text-xs sm:text-sm md:text-base lg:text-2xl font-bold whitespace-nowrap ${
                              row.porcentaje >= 5 && row.porcentaje < 7
                                ? "text-green-500"
                                : row.porcentaje >= 7 && row.porcentaje < 10
                                ? "text-yellow-500"
                                : row.porcentaje >= 10
                                ? "text-red-500"
                                : "text-gray-800"
                            }`}
                          >
                            {row.porcentaje != null
                              ? `${row.porcentaje} %`
                              : "--"}
                          </td>
                          <td className="px- sm:px-1 py-1 text-center text-xs sm:text-sm md:text-base lg:text-2xl text-gray-800 font-bold whitespace-nowrap">
                            {row.cantidad || "--"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-2 sm:px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-500"
                        >
                          No hay datos de recepción disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* COLUMNA CENTRAL - Gráficos */}
          <div className="w-full lg:w-2/5 flex flex-col gap-1 h-[50vh] overflow-y-auto">
            {/* Gráfico 1 */}
            <div className="bg-white rounded-xl shadow-lg flex-1 min-h-0">
              <div className="bg-blue-500 rounded-t-xl">
                <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-1 uppercase text-white">
                  % por rango de hora
                </h2>
              </div>
              <div className="h-[calc(100%-40px)] min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dataAgrupada}
                    margin={{ top: 14, right: 19, left: -35, bottom: 5 }}
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
            <div className="bg-white rounded-xl shadow-ms flex-1 min-h-0">
              <div className="bg-blue-500 rounded-t-xl">
                <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-1 uppercase text-white">
                  % por filer
                </h2>
              </div>
              <div className="h-[calc(100%-40px)] min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dataAgrupadaFilerOrdenada}
                    margin={{ top: 14, right: 22, left: -35, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="rangofiler" />
                    <YAxis tick={false} />
                    <Tooltip
                      formatter={(value) => `${value} `}
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
                    />
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
          {/* COLUMNA DERECHA - Medidores */}
          <div className="w-full lg:w-1/6 flex flex-col gap-2 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[80px] h-[150px] p-2">
              <h4 className="uppercase text-2xl font-bold text-gray-800 text-center">
                % conforme
              </h4>
              <GaugeChart
                value={progressValuePesoNormal}
                colors={{
                  progress:
                    progressValuePesoNormal > 80 ? "#4CAF50" : "#FFC107",
                  remaining: "#F5F5F5",
                  needle: "#E91E63",
                  text: progressValuePesoNormal > 80 ? "#4CAF50" : "#FFC107",
                  labelColor: "#757575",
                }}
                label="Progress"
                fontSize="10px"
                thickness="50%"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[80px] h-[150px] p-2">
              <h4 className="uppercase text-2xl font-bold text-gray-800 text-center">
                % bajo peso
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
                fontSize="10px"
                thickness="50%"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[80px] h-[150px] p-2">
              <h4 className="uppercase text-2xl font-bold text-gray-800 text-center">
                % sobre peso
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
                fontSize="10px"
                thickness="50%"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TablaNuevo;
