import React, { useState, useEffect } from "react";
import LineChartComponent from "./LineChartDual";
import { ResponsiveContainer } from "recharts";
<<<<<<< HEAD
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
  fetchCultivos,
  fetchSedes,
  fetchVariedad,
  fetchCabezal,
  fetchCalidadRangoFiler,
=======
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
    fetchCultivos,
    fetchSedes,
    fetchVariedad,
    fetchCabezal,
    fetchCalidadRangoFiler,
>>>>>>> 79b8f6b7d6d095deef0e30e8b91f2b26d772e260
} from "../utils/api";

const TablaRecepcionArandano = () => {
    // Estados para filtros
    const [fruta, setFruta] = useState("ARANDANO");
    const [sede, setSede] = useState("TODOS");

    // Datos obtenidos de APIs
    const [dataCultivo, setDataCultivo] = useState([]);
    const [dataSedes, setDataSedes] = useState([]);
    const [dataVariedad, setDataVariedad] = useState([]);
    const [dataCabezal, setDataCabezal] = useState([]);

<<<<<<< HEAD
  const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);

  const [, setLoading] = useState(false);
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

  tiposFiler.forEach((filer, index) => {
    colores[filer] = coloresBase[index % coloresBase.length];
  });
=======
    const [dataCalidadRangoFiler, setDataCalidadRangoFiler] = useState([]);
>>>>>>> 79b8f6b7d6d095deef0e30e8b91f2b26d772e260

    const [, setLoading] = useState(false);
    const tiposFiler = Array.isArray(dataCalidadRangoFiler)
        ? [
            ...new Set(
                dataCalidadRangoFiler.map((row) => row.filer?.trim().toUpperCase())
            ),
        ]
        : [];

    const dataAgrupadaFiler = [];

<<<<<<< HEAD
      // Llamadas paralelas
      const [
        resVariedad,
        resCabezal,
        resSede,
        resCultivo,
        resCalidadRangoFiler,
      ] = await Promise.all([
        fetchVariedad(sedeParam, frutaLower),
        fetchCabezal(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
        fetchCalidadRangoFiler(
          sedeParam,
          frutaLower,
          "SELECCIONE",
          "SELECCIONE"
        ),
      ]);
      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data
      setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
      setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataCalidadRangoFiler(
        Array.isArray(resCalidadRangoFiler.data)
          ? resCalidadRangoFiler.data
          : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataVariedad([]);
      setDataCabezal([]);
      setDataSedes([]);
      setDataCultivo([]);
      setDataCalidadRangoFiler([]);
    } finally {
      setLoading(false);
    }
  };
=======
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

>>>>>>> 79b8f6b7d6d095deef0e30e8b91f2b26d772e260

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

    tiposFiler.forEach((filer, index) => {
        colores[filer] = coloresBase[index % coloresBase.length];
    });

<<<<<<< HEAD
  return (
    <div className="">
      {/* Selectores de filtro */}

      <div className="mb-1 flex flex-wrap gap-1 justify-center sm:justify-end items-center">
        {/* SEDE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:min-w-[160px] sm:w-auto">
          <label className="font-bold text-sm sm:text-lg">SEDE:</label>
          <select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataSedes.map((row, idx) => (
              <option key={idx} value={row.sede}>
                {row.sede}
              </option>
            ))}
          </select>
        </div>
=======
    // Función para cargar todos los datos
    const fetchData = async () => {
        try {
            setLoading(true);
>>>>>>> 79b8f6b7d6d095deef0e30e8b91f2b26d772e260

            // Convertir valores a minúsculas para la API si lo requiere
            const frutaLower = fruta.toLowerCase();
            const sedeParam = sede === "TODOS" ? "" : sede;

<<<<<<< HEAD
      <div className="flex flex-col md:flex-row gap-1 w-full">
        <div className="flex flex-col md:flex-row gap-2 w-full px-2 mt-1">
          {/* Tabla Variedad */}
          <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      VARIEDAD
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      EJECUCIÓN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataVariedad.length > 0 ? (
                    dataVariedad.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.var}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.ejec || "--"} Kg
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

          {/* Tabla cabezal */}
          <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      CABEZAL
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                      EJECUTADO
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
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.cabezal || "VACÍO"}
                        </td>
                        <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.ejec || "--"} Kg
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
        </div>
      </div>

      {/* Gráfico de barras por rango de filer */}
    </div>
  );
=======
            // Llamadas paralelas
            const [resVariedad, resCabezal, resSede, resCultivo,
                resCalidadRangoFiler] = await Promise.all([
                    fetchVariedad(sedeParam, frutaLower),
                    fetchCabezal(sedeParam, frutaLower),
                    fetchSedes(),
                    fetchCultivos(),
                    fetchCalidadRangoFiler(sedeParam, frutaLower, "SELECCIONE", "SELECCIONE"),
                ]);
            // Verificar si las respuestas son válidas y asignar los datos
            // si no, asignar un array vacío

            // Las respuestas de axios ya traen el objeto data
            setDataVariedad(Array.isArray(resVariedad.data) ? resVariedad.data : []);
            setDataCabezal(Array.isArray(resCabezal.data) ? resCabezal.data : []);
            setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
            setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
            setDataCalidadRangoFiler(
                Array.isArray(resCalidadRangoFiler.data)
                    ? resCalidadRangoFiler.data
                    : []
            );

        } catch (err) {
            console.error("Error fetching data:", err);
            setDataVariedad([]);
            setDataCabezal([]);
            setDataSedes([]);
            setDataCultivo([]);
            setDataCalidadRangoFiler([]);
        } finally {
            setLoading(false);
        }
    };

    // Ejecutar fetchData cuando cambie fruta o sede
    useEffect(() => {
        fetchData(); // Llamada inicial

        const intervaloId = setInterval(() => {
            fetchData(); // Actualización cada 10 segundos
        }, 10000);

        return () => clearInterval(intervaloId); // Limpieza del intervalo
    }, [fruta, sede]);

    return (
        <div className="">
            {/* Selectores de filtro */}

            <div className="mb-1 flex flex-wrap gap-1 justify-center sm:justify-end items-center">
                {/* SEDE */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:min-w-[160px] sm:w-auto">
                    <label className="font-bold text-sm sm:text-lg">SEDE:</label>
                    <select
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                        className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
                    >
                        <option value="TODOS">TODOS</option>
                        {dataSedes.map((row, idx) => (
                            <option key={idx} value={row.sede}>
                                {row.sede}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CULTIVO */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:min-w-[160px] sm:w-auto">
                    <label className="font-bold text-sm sm:text-lg">CULTIVO:</label>
                    <select
                        value={fruta}
                        onChange={(e) => setFruta(e.target.value)}
                        className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
                    >
                        {dataCultivo.map((row, idx) => (
                            <option key={idx} value={row.cultivo}>
                                {row.cultivo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <div className="flex flex-col md:flex-row gap-4 w-full px-2">
                    {/* Tabla Variedad */}
                    <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
                        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                                            VARIEDAD
                                        </th>
                                        <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                                            EJECUCIÓN
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dataVariedad.length > 0 ? (
                                        dataVariedad.map((row, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                                                    {row.var}
                                                </td>
                                                <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                                                    {row.ejec || "--"} Kg
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

                    {/* Tabla cabezal */}
                    <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
                        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                            <table className="w-full min-w-[300px] border-collapse overflow-x-auto">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                                            CABEZAL
                                        </th>
                                        <th className="px-2 py-2 text-center font-semibold text-base sm:text-4xl uppercase">
                                            EJECUTADO
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
                                                <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                                                    {row.cabezal || "VACÍO"}
                                                </td>
                                                <td className="px-2 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                                                    {row.ejec || "--"} Kg
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
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full px-2">

                    {/* Gráfico 2 */}
                    <div className="flex-1 min-h-0 overflow-hidden rounded-xl shadow-lg">
                        <div className="bg-blue-500 rounded-t-xl">
                            <h2 className="text-center text-lg sm:text-2xl font-bold mb-1 uppercase text-white">
                                Porcentaje por filer
                            </h2>
                        </div>
                        <div className="h-[300px] sm:min-h-[200px]">
                            <ResponsiveContainer width="100%" height="90%">
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
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
>>>>>>> 79b8f6b7d6d095deef0e30e8b91f2b26d772e260
};

export default TablaRecepcionArandano;
