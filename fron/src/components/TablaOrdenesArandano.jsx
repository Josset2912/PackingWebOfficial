import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaOrdenesArandano = () => {
  const [dataOrdenPRD, setDataOrdenPRD] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fruta, setFruta] = useState("Arandano");

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const frutaParam = fruta.toLowerCase();
      /*  const queryParams = `?Cod=''&Camara=''&Cultivo=${frutaParam}`; */

      const [resOrdenPRD] = await Promise.all([
        /*  axios.get(
                `http://10.250.200.9:8650/api/esperaVolcadoAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ), */
        axios.get(
          `http://10.250.200.9:8650/api/ordenesPTAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
        ),
      ]);

      setDataOrdenPRD(Array.isArray(resOrdenPRD.data) ? resOrdenPRD.data : []);
    } catch (err) {
      console.error("Error en la carga:", err);
      setError("No se pudieron cargar los datos");
      setDataOrdenPRD([]);
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

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Selector de cultivo */}
      <div className="mb-0.5 flex flex-wrap items-center justify-end gap-2">
        <label className="font-bold text-sm sm:text-lg mr-2">CULTIVO:</label>
        <select
          value={fruta}
          onChange={(e) => setFruta(e.target.value)}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
        >
          <option value="Arandano">ARANDANO</option>
          <option value="Uva">UVA</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <table className="w-full min-w-[300px] border-collapse">
            <thead className="sticky top-0 z-10 bg-teal-600 text-white">
              <tr>
                {[
                  "ORDEN",
                  "PRIORIDAD",
                  "DESTINO",
                  "PRESENTACIÓN",
                  "EJEC. PROY",
                  "F. DESPACHO",
                ].map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-sm sm:text-3xl font-semibold uppercase tracking-wider text-center"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataOrdenPRD.length > 0 ? (
                dataOrdenPRD.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-cyan-50`}
                  >
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.ORDEN}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-800 font-medium">
                      {row.PRIORIDAD}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.DESTINO}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.PRESENTACION}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.EJEC_PROY}
                    </td>
                    <td className="px-4 py-2 text-center text-sm sm:text-1xl text-gray-700">
                      {row.F_DESPACHO}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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
  );
};

export default TablaOrdenesArandano;
