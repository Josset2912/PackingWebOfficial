import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaGasificadoArandano = () => {
  const [dataGasificado, setDataGasificado] = useState([]);
  const [dataGasificadoBatch, setDataGasificadoBatch] = useState([]);
  const [dataFrio, setDataFrio] = useState([]);
  const [dataFrioBatch, setDataFrioBatch] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [dataSedes, setDataSede] = useState([]);
  const [sedes, setSedes] = useState("TODOS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const frutaParam = fruta.toLowerCase();
      const sedeParam = sedes.toLowerCase();

      /*  const queryParams = `?Cod=''&Camara=''&Cultivo=${frutaParam}`; */

      const [
        resGasificado,
        resFrio,
        resGasificadoBatch,
        resFrioBatch,
        resSede,
        resCultivo,
      ] = await Promise.all([
        /*  axios.get(
                `http://10.250.200.9 :8650/api/gasificadoPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9 :8650/api/gasificadoPreFrioAran?Cod=''&Camara=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9 :8650/api/gasificadoBatchPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9 :8650/api/gasificadoBatchPreFrioAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ), */
        axios.get("http://10.250.200.9:8650/api/gasificadoPreAran", {
          params: {
            Cod: "",
            Sede: sedeParam,
            Cultivo: frutaParam,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/gasificadoPreFrioAran", {
          params: {
            Cod: "",
            Sede: sedeParam,
            Cultivo: frutaParam,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/gasificadoBatchPreAran", {
          params: {
            Cod: "",
            Sede: sedeParam,
            Cultivo: frutaParam,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/gasificadoBatchPreFrioAran", {
          params: {
            Cod: "",
            Sede: sedeParam,
            Cultivo: frutaParam,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/sede", {
          params: {
            Emp: "",
          },
        }),
        axios.get("http://10.250.200.9:8650/api/cultivo", {}),
      ]);

      setDataGasificado(
        Array.isArray(resGasificado.data) ? resGasificado.data : []
      );
      setDataFrio(Array.isArray(resFrio.data) ? resFrio.data : []);
      setDataGasificadoBatch(
        Array.isArray(resGasificadoBatch.data) ? resGasificadoBatch.data : []
      );
      setDataFrioBatch(
        Array.isArray(resFrioBatch.data) ? resFrioBatch.data : []
      );
      setDataSede(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error en la carga:", err);
      setError("No se pudieron cargar los datos");
      setDataGasificado([]);
      setDataFrio([]);
      setDataGasificadoBatch([]);
      setDataFrioBatch([]);
      setDataSede([]);
      setDataCultivo([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sedes, fruta]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervaloId);
  }, [sedes, fruta]);

  return (
    <div className="">
      {/* Selector de cultivo - Ajuste completo para todos los tamaños */}
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
            {dataSedes.length > 0 ? (
              dataSedes.map((row, index) => (
                <option key={index} value={row.Sede}>
                  {row.Sede}
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
                <option key={index} value={row.Cultivo}>
                  {row.Cultivo}
                </option>
              ))
            ) : (
              <option disabled></option>
            )}
          </select>
        </div>
      </div>

      {/* Grid principal - Ajuste responsivo completo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        {/*Gasificado */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/*tabla Gasificado */}
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(60vh-70px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                ESPERA GASIFICADO
              </h2>
            </div>
            <div className="overflow-y-auto ">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead className="sticky top-0 z-10">
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
                  {error ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataGasificado.length > 0 ? (
                    dataGasificado.map((row, index) => (
                      <tr
                        key={`gasificado-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-medium">
                          {row.PALET || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700">
                          {row.ESPERA ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
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

          {/* Tabla Gasificado Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(40vh-35px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                BATCH GASIFICADO
              </h2>
            </div>
            <div className="overflow-y-auto ">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r bg-indigo-600 text-white">
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
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataGasificadoBatch.length > 0 ? (
                    dataGasificadoBatch.map((row, index) => (
                      <tr
                        key={`gasificado-batch-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-medium">
                          {row.BATCH || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-800 font-medium">
                          {row.PALETS ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700">
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

        {/* Espacio entre tablas Gasificado y Frío */}

        {/*  Pre Frío */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] ">
          {/* Tabla Pre Frío */}
          <div className="mb-1 bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(60vh-70px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                ESPERA PRE FRÍO
              </h2>
            </div>

            <div className="overflow-y-auto">
              <table className="w-full min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] border-collapse">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      PALET
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      ESPERA
                    </th>
                    <th className="px-2 xs:px-3 sm:px-4 py-2 text-center font-semibold text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataFrio.length > 0 ? (
                    dataFrio.map((row, index) => (
                      <tr
                        key={`frio-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700">
                          {row.PALET || "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700">
                          {row.ESPERA ?? "N/A"}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 py-2 text-center text-base xs:text-lg sm:text-xl md:text-3xl text-gray-700">
                          {row.TOTAL ?? "N/A"}
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

          {/* Tabla Pre Frío Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-y-auto max-h-[calc(40vh-35px)]">
            <div className="px-3 xs:px-4 sm:px-6 py-1">
              <h2 className="text-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl text-black uppercase">
                BATCH PRE FRIO
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
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-center text-red-500 text-sm sm:text-base"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : dataFrioBatch.length > 0 ? (
                    dataFrioBatch.map((row, index) => (
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
      </div>
      {/*  */}
    </div>
  );
};

export default TablaGasificadoArandano;
