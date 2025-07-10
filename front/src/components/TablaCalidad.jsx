import React, { useState, useEffect } from "react";
import LineChartComponent from "./LineChartDual";
import { ResponsiveContainer } from "recharts";
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
  fetchCalidad,
  fetchCalidadRango, // Cambiado a fetchCalidadRango
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

  const [dataCalidadRango, setDataCalidadRango] = useState([]);
  const [dataCalidad, setDataCalidad] = useState([]);

  const [dataCalidadFiler, setDataCalidadFiler] = useState([]);


  // Obtener los tipos de peso únicos de dataCalidadRango
  const tiposPeso = Array.isArray(dataCalidadRango)
    ? [
        ...new Set(
          dataCalidadRango.map((row) => row.tipO_PESO?.trim().toUpperCase())
        ),
      ]
    : [];
  //  los tipos de filer
/*   const tiposFiler = Array.isArray(dataCalidadFiler)
    ? [
        ...new Set(
          dataCalidadFiler.map((row) => row.filer?.trim().toUpperCase())
        ),
      ]
        : [];
    
    const dataAgrupadaFiler = [];
    dataCalidadFiler.forEach(({ rango, filer, porcentajetotal }) => {
      const tipo = filer?.trim().toUpperCase();
      if (!rango || !tipo) return;
      let existente = dataAgrupadaFiler.find((item) => item.rango === rango);
      if (!existente) {
        existente = { rango };
        dataAgrupadaFiler.push(existente);
      }
      existente[tipo] = porcentajetotal;
    });
    dataAgrupadaFiler.forEach((item) => {
      tiposPeso.forEach((tipo) => {
        if (!(tipo in item)) {
          item[tipo] = 0;
        }
      });
    }); */
    
    
    //========================

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

  const colores = {
    "BAJO PESO": "#1f77b4",
    "SOBRE PESO": "#ff7f0e",
  };
  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;
      const maquinaParam = maquina === "UNITEC" ? "" : maquina;
      const filerParam = filer === "F1" ? "" : filer;

      // Llamadas paralelas
      const [
        resCalidad,
        resCalidadRango,
        resSede,
        resCultivo,
        resMaquina,
        resFiler,
      ] = await Promise.all([
        fetchCalidad(sedeParam, frutaLower, maquinaParam, filerParam),
        fetchCalidadRango(sedeParam, frutaLower, maquinaParam, filerParam),
        fetchSedes(),
        fetchCultivos(),
        fetchMaquina(frutaLower),
        fetchFiler(maquinaParam),
      ]);

      // Las respuestas de axios ya traen el objeto data
      setDataCalidad(Array.isArray(resCalidad.data) ? resCalidad.data : []);
      setDataCalidadRango(
        Array.isArray(resCalidadRango.data) ? resCalidadRango.data : []
      );
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataFiler(Array.isArray(resFiler.data) ? resFiler.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataCalidad([]);
      setDataCalidadRango([]);
      setDataSedes([]);
      setDataCultivo([]);
      setDataMaquina([]);
      setDataFiler([]);
    }
  };
  // Combinar dataCalidadVariedad y dataCalidadCabezal para el gráfico

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // Actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // Limpieza del intervalo
  }, [sede, fruta, maquina, filer]);

  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
      {/* Selector de cultivo y sede */}
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sede}
            onChange={(e) => setSedes(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataSedes.length > 0 ? (
              dataSedes.map((row, index) => (
                <option key={index} value={row.sede}>
                  {row.sede}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>

        {/* CULTIVO */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            CULTIVO:
          </label>
          <select
            value={fruta}
            onChange={(e) => setFruta(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataCultivo.length > 0 ? (
              dataCultivo.map((row, index) => (
                <option key={index} value={row.cultivo}>
                  {row.cultivo}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>
        {/* MAQUINA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            MAQUINA:
          </label>
          <select
            value={maquina}
            onChange={(e) => setMaquina(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataMaquina.map((row, index) => (
              <option key={index} value={row.maquina}>
                {row.maquina}
              </option>
            ))}
          </select>
        </div>

        {/* LINEA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            LINEA:
          </label>
          <select
            value={filer}
            onChange={(e) => setFiler(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataFiler.length > 0 ? (
              dataFiler.map((row, index) => (
                <option key={index} value={row.filer}>
                  {row.filer}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full px-2">
        {/* Tabla Variedad */}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            <table className="w-full min-w-[300px] border-collapse">
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
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.tipO_PESO || "--"}
                      </td>
                      <td className="px-2 py-2 text-center text-sm sm:text-2xl text-gray-800 font-medium">
                        {row.porcentaje || "--"} %
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
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

        {/* //rango(columna X),
              // tipo_peso (leyenda),
              // porcentajetotal (columna y)*/}
        <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
          <div className="p-1 bg-blue-500 rounded-t-xl">
            <h2 className="text-center text-lg sm:text-2xl font-bold mb-1 uppercase text-white">
              Porcentaje por rango de hora
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataAgrupada}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rango" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} %`} />
              <Legend />
              {tiposPeso.map((tipo) => (
                <Line
                  key={tipo}
                  type="monotone"
                  dataKey={tipo}
                  stroke={colores[tipo] || "#000000"}
                  dot={true}
                  label={({ x, y, value }) => (
                    <text
                      x={x}
                      y={y - 10} // ajusta para que no choque con el punto
                      fill="#000"
                      fontSize={12}
                      textAnchor="middle"
                    >
                      {`${value} %`}
                    </text>
                  )}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Gráfico de filer */}
{/*           <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataAgrupada}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rango" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} %`} />
              <Legend />
              {tiposPeso.map((tipo) => (
                <Line
                  key={tipo}
                  type="monotone"
                  dataKey={tipo}
                  stroke={colores[tipo] || "#000000"}
                  dot={true}
                  label={({ x, y, value }) => (
                    <text
                      x={x}
                      y={y - 10} // ajusta para que no choque con el punto
                      fill="#000"
                      fontSize={12}
                      textAnchor="middle"
                    >
                      {`${value} %`}
                    </text>
                  )}
                />
              ))}
            </LineChart>
          </ResponsiveContainer> */}
        </div>
      </div>
    </div>
  );
};
export default TablaCalidad;
