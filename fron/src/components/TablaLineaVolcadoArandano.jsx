import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaLineaVolcadoArandano = () => {
  const [dataLineaAvance, setDataLineaAvance] = useState([]);
  const [dataProximoPalet, setDataProximoPalet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maquina, setSeleccion] = useState("UNITEC");
  const [cultivo, setCultivo] = useState("ARANDANO");
  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  // Mover fetchData fuera de useEffect para que esté disponible globalmente en el componente
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const frutaParam = cultivo.toLowerCase();
      const maquinaParam = maquina.toLowerCase();

      // Peticiones paralelas
      const [resAvanceLinea, resProximoPalet] = await Promise.all([
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: "ASA",
            Cultivo: frutaParam,
            Turno: "TARDE",
            Maquina: maquinaParam,
            Id: 1,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: "ASA",
            Cultivo: frutaParam,
            Turno: "TARDE",
            Maquina: maquinaParam,
            Id: 2,
          },
        }),
      ]);

      setDataLineaAvance(
        Array.isArray(resAvanceLinea.data) ? resAvanceLinea.data : []
      );
      setDataProximoPalet(
        Array.isArray(resProximoPalet.data) ? resProximoPalet.data : []
      );
    } catch (err) {
      console.error("Error en la carga:", err);
      setError("No se pudieron cargar los datos.");
      setDataLineaAvance([]);
      setDataProximoPalet([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [maquina, cultivo, fecha]);

  useEffect(() => {
    const intervaloId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervaloId);
  }, []);

  const handleCambioMaquina = (e) => setSeleccion(e.target.value);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Filtros */}
      <div className="mb-1 flex flex-col md:flex-row justify-end gap-4">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="p-1 border border-green-600 text-xl font-bold text-green-800 rounded"
        />

        <select
          onChange={(e) => setCultivo(e.target.value)}
          value={cultivo}
          className="p-1 border border-green-600 text-xl font-bold text-green-800 rounded"
        >
          <option value="ARANDANO">ARANDANO</option>
          <option value="Uva">UVA</option>
        </select>

        <select
          onChange={handleCambioMaquina}
          value={maquina}
          className="p-1 border border-green-600 text-xl font-bold text-green-800 rounded"
          disabled={loading}
        >
          <option value="UNITEC">UNITEC</option>
          <option value="DUAL KATO1">DUAL KATO1</option>
          <option value="DUAL KATO2">DUAL KATO2</option>
          <option value="DUAL KATO3">DUAL KATO3</option>
          <option value="DUAL KATO4">DUAL KATO4</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-4 text-xl font-semibold text-red-600 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabla Línea Avance */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-1">
            <h2 className="text-center font-bold text-xl md:text-4xl text-black uppercase tracking-wider">
              KG PROY VS EJEC
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-3xl uppercase">
                      VAR
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-3xl uppercase">
                      PROY
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-3xl uppercase">
                      EJEC
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-3xl uppercase">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataLineaAvance.length > 0 ? (
                    dataLineaAvance.map((row, index) => (
                      <tr
                        key={`lineaAvance-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.VAR || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.PROY || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.EJEC || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-700">
                          {row.PORCENTAJE || "N/A"} %
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-center text-gray-500 italic"
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

        {/* Tabla Próximo Palet */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-1">
            <h2 className="text-center font-bold text-xl md:text-4xl text-black uppercase tracking-wider">
              SGTE PALET
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-teal-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-3xl uppercase">
                      PALET
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataProximoPalet.length > 0 ? (
                    dataProximoPalet.map((row, index) => (
                      <tr
                        key={`proximoPalet-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-4 py-2 text-center md:text-3xl text-gray-800 font-medium">
                          {row.PALET || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="1"
                        className="px-4 py-3 text-center text-gray-500 italic"
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
    </div>
  );
};

export default TablaLineaVolcadoArandano;
