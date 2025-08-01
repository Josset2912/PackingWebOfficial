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

  const [dataCalidadRango, setDataCalidadRango] = useState([]);
  const [dataCalidad, setDataCalidad] = useState([]);

  const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);

  const [dataCalidadPorcentaje, setDataCalidadPorcentaje] = useState([]);
  const [progressValueBajoPeso, setProgressValueBajoPeso] = useState(0);
  const [progressValuePesoNormal, setProgressValuePesoNormal] = useState(0);
  const [progressValueSobrePeso, setProgressValueSobrePeso] = useState(0);

  //  los tipos de filer
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
  //========================
  // Obtener los tipos de peso únicos de dataCalidadRango
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
        fetchPresentacion(sedeParam, frutaLower, maquinaParam, filerParam),
        fetchCalidad(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam
        ),
        fetchCalidadRango(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam
        ),
        fetchCalidadRangoFiler(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam
        ),
        fetchCalidadPorcentajeMuestras(
          sedeParam,
          frutaLower,
          maquinaParam,
          filerParam,
          presentacionParam
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
  }, [sede, fruta, maquina, filer, presentacion]);

  return (
    <div className="">
      {/* Selector de cultivo y sede */}
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center ">
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

        {/* MAQUINA */}
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
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full px-2">
        {/* TABLA VARIEDAD - IZQUIERDA */}
        <div className="lg:w-1/2 w-full overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[200px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-600 text-white">
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    LINEA
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    PRESENTACION
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    TIPO PESO
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    %
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-base sm:text-3xl uppercase">
                    CANT
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

        {/* GRAFICOS - CENTRO */}
        <div className="lg:w-1/3 w-full flex flex-col gap-1 h-auto lg:h-[calc(100vh-100px)] lg:overflow-hidden">
          {/* Gráfico 1 */}
          <div className="rounded-xl shadow-lg bg-white h-[300px] sm:h-[400px] lg:h-[50%]">
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
                  <CartesianGrid strokeDasharray="3 3" />
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

          {/* Gráfico 2 */}
          <div className="rounded-xl shadow-lg bg-white h-[300px] sm:h-[400px] lg:h-[50%]">
            <div className="bg-blue-500 rounded-t-xl">
              <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-2xl font-bold mb-1 uppercase text-white">
                Porcentaje por filer
              </h2>
            </div>
            <div className="h-[calc(100%-40px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataAgrupadaFiler}
                  margin={{ top: 19, right: 19, left: -35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rangofiler" />
                  <YAxis tick={false} />
                  <Tooltip formatter={(value) => `${value} %`} />
                  <Legend />
                  {tiposFiler.map((tipo) => (
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

        {/* Ta */}
        <div className="lg:w-1/5 w-full flex flex-col gap-1 h-auto lg:h-[calc(100vh-100px)] lg:overflow-hidden justify-center items-center">
          {/* medidor */}

          <div className="w-full flex-1 bg-white rounded-xl shadow-lg  flex flex-col justify-center">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 ">
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

          <div className="w-full flex-1 bg-white rounded-xl shadow-lg  flex flex-col justify-center">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 ">
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
          <div className="w-full flex-1 bg-white rounded-xl shadow-lg  flex flex-col justify-center">
            <h4 className="uppercase text-2xl text-center font-bold text-gray-800 ">
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
