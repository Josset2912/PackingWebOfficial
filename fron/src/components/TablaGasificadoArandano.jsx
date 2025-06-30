import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaGasificadoArandano = () => {
  const [fruta, setFruta] = useState("Arandano");
  const [dataGasificado, setDataGasificado] = useState([]);
  const [dataGasificadoBatch, setDataGasificadoBatch] = useState([]);
  const [dataFrio, setDataFrio] = useState([]);
  const [dataFrioBatch, setDataFrioBatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const frutaParam = fruta.toLowerCase();
      /*  const queryParams = `?Cod=''&Camara=''&Cultivo=${frutaParam}`; */

      const [resGasificado, resFrio, resGasificadoBatch, resFrioBatch] =
          await Promise.all([
            axios.get(
                `http://10.250.200.9:8650/api/gasificadoPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9:8650/api/gasificadoPreFrioAran?Cod=''&Camara=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9:8650/api/gasificadoBatchPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ),
              axios.get(
                `http://10.250.200.9:8650/api/gasificadoBatchPreFrioAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ),
          /* axios.get(
            `http://10.51.51.15:8650/api/gasificadoPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
          ),
          axios.get(
            `http://10.51.51.15:8650/api/gasificadoPreFrioAran?Cod=''&Camara=''&Cultivo=${frutaParam}`
          ),
          axios.get(
            `http://10.51.51.15:8650/api/gasificadoBatchPreAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
          ),
          axios.get(
            `http://10.51.51.15:8650/api/gasificadoBatchPreFrioAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
          ), */
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
    } catch (err) {
      console.error("Error en la carga:", err);
      setError("No se pudieron cargar los datos");
      setDataGasificado([]);
      setDataFrio([]);
      setDataGasificadoBatch([]);
      setDataFrioBatch([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fruta]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervaloId);
  }, [fruta]);

  const cantidadGasificado = dataGasificado.filter(
    (row) => row.ESPERA > 0
  ).length;
  const cantidadFrio = dataFrio.filter((row) => row.ESPERA > 0).length;

  return (
    <div className="container mx-auto">
      <div className="mb-0 not-first:mb-0 flex items-center justify-end">
        <label className="font-bold text-lg mr-2">CULTIVO:</label>
        <select
          value={fruta}
          onChange={(e) => setFruta(e.target.value)}
          className="p-1 border border-green-600 text-xl font-bold text-green-800 rounded"
        >
          <option value="Arandano">ARANDANO</option>
          <option value="Uva">UVA</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Gasificado */}
        <div className="space-y-6">
          {/* Tabla Gasificado #1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1 ">
              <h2 className="text-center font-bold text-xl md:text-2xl text-black uppercase tracking-wider">
                ESPERA GASIFICADO ARÁNDANO ({cantidadGasificado})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      PALET
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      ESPERA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-3 text-center text-red-500 font-medium"
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
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.PALET || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.ESPERA ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-3 text-center text-gray-500 italic"
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-xl md:text-2xl text-black uppercase tracking-wider">
                BATCH GASIFICADO
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      BATCH
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      PALETS
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-red-500 font-medium"
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
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.BATCH || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.PALETS ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.TIME ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-gray-500 italic"
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

        {/* Columna Frío */}
        <div className="space-y-6">
          {/* Tabla Frío */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-xl md:text-2xl text-black uppercase tracking-wider">
                ESPERA PRE FRÍO ARÁNDANO ({cantidadFrio})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      PALET
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      ESPERA
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-red-500 font-medium"
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
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.PALET || row.PALET || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.ESPERA ?? row.ESPERA ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.TOTAL ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-gray-500 italic"
                      >
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla Frío Batch */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-xl md:text-2xl text-black uppercase tracking-wider">
                BATCH PRE FRIO
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      BATCH
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      PALETS
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-4xl md:text-3xl uppercase tracking-wider">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-red-500 font-medium"
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
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.BATCH || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.PALETS ?? "N/A"}
                        </td>
                        <td className="ppx-4 py-2 text-center md:text-3xl text-gray-800">
                          {row.TIME ?? "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-center text-gray-500 italic"
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
    </div>
  );
};

export default TablaGasificadoArandano;
