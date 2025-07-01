import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaFrioArandano = () => {
  const [fruta, setFruta] = useState("Arandano");
  const [dataFrio, setDataFrio] = useState([]);
  const [dataEnfriando, setDataEnfriando] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (frutaParam = fruta) => {
    try {
      setLoading(true);
      const frutaLower = frutaParam.toLowerCase();

      const [resFrio, resEnfriando] = await Promise.all([
        axios.get(
          `http://10.250.200.9:8650/api/esperaFrioAran?Cod=''&Turno=''&Cultivo=${frutaLower}`
        ),
        axios.get(
          `http://10.250.200.9:8650/api/enfriandoAran?Cod=''&Turno=''&Cultivo=${frutaLower}`
        ),
      ]);

      setDataFrio(resFrio.data);
      setDataEnfriando(resEnfriando.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataFrio([]);
      setDataEnfriando([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect corregido (evita doble render)
  useEffect(() => {
    fetchData(); // llamada inicial

    const intervaloId = setInterval(() => {
      fetchData(); // actualización cada 10 segundos
    }, 10000);

    return () => clearInterval(intervaloId); // limpieza del intervalo
  }, [fruta]);

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Select de fruta */}
      <div className="mb-1 flex flex-wrap items-center justify-end gap-2">
        <label className="mr-1 font-bold text-sm sm:text-lg align-sub">
          CULTIVO:
        </label>
        <select
          value={fruta}
          onChange={(e) => setFruta(e.target.value)}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
        >
          <option value="ARANDANO">ARANDANO</option>
          <option value="Uva">UVA</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Cargando datos...
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Tabla Espera Frío */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
                ESPERA FRÍO
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <table className="w-full min-w-[300px] border-collapse">
                  <thead className="sticky top-0 z-10 bg-indigo-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase tracking-wider">
                        PALET
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase tracking-wider">
                        ESPERA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dataFrio.length > 0 ? (
                      dataFrio.map((row, index) => (
                        <tr
                          key={`gasificado-${index}`}
                          className={`transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                          } hover:bg-indigo-100`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                            {row.PALET || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
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

          {/* Tabla Enfriando */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-1">
              <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
                ENFRIANDO
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <table className="w-full min-w-[300px] border-collapse">
                  <thead className="sticky top-0 z-10 bg-teal-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase tracking-wider">
                        PALET
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase tracking-wider">
                        ENFRIANDO
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase tracking-wider">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dataEnfriando.length > 0 ? (
                      dataEnfriando.map((row, index) => (
                        <tr
                          key={`frio-${index}`}
                          className={`transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-teal-50"
                          } hover:bg-teal-100`}
                        >
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                            {row.PALET || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                            {row.ENFRIANDO || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-sm sm:text-3xl text-teal-800">
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
        </div>
      )}
    </div>
  );
};

export default TablaFrioArandano;
