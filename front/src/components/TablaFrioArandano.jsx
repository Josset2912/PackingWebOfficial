import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const TablaFrioArandano = () => {
  // Estados principales
  const [fruta, setFruta] = useState("Arandano");
  const [dataCultivo, setDataCultivo] = useState([]);
  const [sedes, setSedes] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);
  const [dataFrio, setDataFrio] = useState([]);
  const [dataEnfriando, setDataEnfriando] = useState([]);
  const [dataBatchEnfriando, setDataBatchEnfriando] = useState([]);

  // Función memoizada para obtener los datos (no se recrea en cada render)
  const fetchData = async () => {
    try {
      const frutaLower = fruta.toLowerCase();
      const sedeLower = sedes.toLowerCase();

      const [resFrio, resEnfriando, resBatchEnfriando, resSede, resCultivo] =
        await Promise.all([
          axios.get("http://10.250.200.9:8650/api/esperaFrioAran", {
            params: {
              fruta: frutaLower,
              sede: sedeLower,
              Cultivo: frutaLower,
            },
          }),
          axios.get("http://10.250.200.9:8650/api/enfriandoAran", {
            params: {
              fruta: frutaLower,
              sede: sedeLower,
              Cultivo: frutaLower,
            },
          }),
          axios.get("http://10.250.200.9:8650/api/enfriandoBatchPreFrioAran", {
            params: {
              Cod: "",
              Sede: sedeLower,
              Cultivo: frutaLower,
            },
          }),
          axios.get("http://10.250.200.9:8650/api/sede", {
            params: { Emp: "" },
          }),
          axios.get("http://10.250.200.9:8650/api/cultivo"),
        ]);

      setDataFrio(Array.isArray(resFrio.data) ? resFrio.data : []);
      setDataEnfriando(
        Array.isArray(resEnfriando.data) ? resEnfriando.data : []
      );
      setDataBatchEnfriando(
        Array.isArray(resBatchEnfriando.data) ? resBatchEnfriando.data : []
      );
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataFrio([]);
      setDataEnfriando([]);
      setDataBatchEnfriando([]);
      setDataCultivo([]);
      setDataSedes([]);
    }
  }; // ← sin dependencias

  // Actualizamos los refs cuando cambian los filtros
  useEffect(() => {
    fetchData();
  }, [fruta, sedes]);

  // Solo se crea una vez el intervalo, y usamos refs para obtener los filtros actuales
  useEffect(() => {
    const intervalo = setInterval(() => {
      fetchData(); // llamadas cada 10s sin recrear el intervalo
    }, 10000);

    return () => clearInterval(intervalo); // limpieza
  }, [fruta, sedes]); // solo una vez al montar

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Selectores */}
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sedes}
            onChange={(e) => setSedes(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            <option value="TODOS">TODOS</option>
            {dataSedes.length > 0 &&
              dataSedes.map((row, index) => (
                <option key={index} value={row.Sede}>
                  {row.Sede}
                </option>
              ))}
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
            {dataCultivo.length > 0 &&
              dataCultivo.map((row, index) => (
                <option key={index} value={row.Cultivo}>
                  {row.Cultivo}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Contenido */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        {/*ESPERA FRÍO */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/* ---------- Tabla ESPERA FRÍO ---------- */}
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(100vh-100px)]">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
                ESPERA FRIO
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <table className="w-full min-w-[400px] border-collapse">
                  <thead className="sticky top-0 z-10 shadow-md">
                    <tr className="bg-indigo-600 text-white">
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        PALET
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        ESPERA
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {dataFrio.length > 0 ? (
                      dataFrio.map((row, index) => (
                        <tr
                          key={`frio-${index}`}
                          className={`transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                          } hover:bg-indigo-100`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-xl text-gray-800 font-medium">
                            {row.PALET || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-xl text-gray-700">
                            {row.ESPERA || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic"
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
        </div>

        {/*  ENFRIANDO */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/* ---------- Tabla ENFRIANDO ---------- */}
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(60vh-70px)]">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
                ENFRIANDO
              </h2>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <table className="w-full min-w-[500px] border-collapse">
                  <thead className="sticky top-0 z-10 shadow-md">
                    <tr className="bg-teal-600 text-white">
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        PALET
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        ENFRIANDO
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                        TOTAL
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {dataEnfriando.length > 0 ? (
                      dataEnfriando.map((row, index) => (
                        <tr
                          key={`enfriando-${index}`}
                          className={`transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-teal-50"
                          } hover:bg-teal-100`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-xl text-gray-800 font-medium">
                            {row.PALET || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-xl text-gray-700">
                            {row.ENFRIANDO || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-xl text-teal-800">
                            {row.TOTAL || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-center text-sm sm:text-base text-gray-500 italic"
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

          {/* Tabla enfriando Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(40vh-35px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                BATCH ENFRIANDO
              </h2>
            </div>
            <div className="overflow-y-auto">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      BATCH
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALETS
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataBatchEnfriando.length > 0 ? (
                    dataBatchEnfriando.map((row, index) => (
                      <tr
                        key={`frio-batch-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-medium">
                          {row.BATCH || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-medium">
                          {row.PALETS ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800">
                          {row.TIME ?? "N/A"}
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
        {/*  */}
      </div>

      {/*  */}
    </div>
  );
};

export default TablaFrioArandano;
