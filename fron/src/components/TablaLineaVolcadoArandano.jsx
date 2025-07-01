import React, { useState, useEffect } from "react";
import axios from "axios";
import GaugeChart from "./Medidor"; // Asegúrate de que la ruta sea correcta

const TablaEsperaArandano = () => {
  const [dataLineaVolcado, setDataLineaVolcado] = useState([]);
  const [dataSgtePalet, setDataSgtePalet] = useState([]);
  const [dataPorcentaje, setDataPorcentaje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maquina, setSeleccion] = useState("UNITEC");
  const [cultivo, setCultivo] = useState("ARANDANO");
  const [progressValue, setProgressValue] = useState(0);
  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  // Move fetchData outside so it's accessible in both useEffects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const frutaParam = cultivo.toLowerCase();
      const maquinaParam = maquina.toLowerCase();
      /*  const queryParams = `?Cod=''&Camara=''&Cultivo=${frutaParam}`; */

      const [resLineaVolcado, resSgtePalet, resPorcentaje] = await Promise.all([
        /*  axios.get(
                `http://10.250.200.9:8650/api/esperaVolcadoAran?Cod=''&Turno=''&Cultivo=${frutaParam}`
              ), */
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
        //10.51.51.15:8650
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
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: "ASA",
            Cultivo: frutaParam,
            Turno: "TARDE",
            Maquina: maquinaParam,
            Id: 3,
          },
        }),
      ]);

      setDataLineaVolcado(
        Array.isArray(resLineaVolcado.data) ? resLineaVolcado.data : []
      );
      setDataSgtePalet(
        Array.isArray(resSgtePalet.data) ? resSgtePalet.data : []
      );
      setDataPorcentaje(
        Array.isArray(resPorcentaje.data) ? resPorcentaje.data : []
      );

      // Establecer el valor del medidor
      if (Array.isArray(resPorcentaje.data) && resPorcentaje.data.length > 0) {
        const porcentaje = parseFloat(resPorcentaje.data[0].PORCENTAJE);
        if (!isNaN(porcentaje)) {
          setProgressValue(porcentaje);
        } else {
          setProgressValue(0);
        }
      } else {
        setProgressValue(0);
      }

      if (Array.isArray(resPorcentaje.data) && resPorcentaje.data.length > 0) {
        const porcentaje = parseFloat(resPorcentaje.data[0].PORCENTAJE);
        if (!isNaN(porcentaje)) {
          setProgressValue(porcentaje);
        } else {
          setProgressValue(0); // Valor por defecto si el valor no es válido
        }
      } else {
        setProgressValue(0); // Valor por defecto si no hay datos
      }
    } catch (err) {
      console.error("Error en la carga:", err);
      setError("No se pudieron cargar los datos");
      setDataLineaVolcado([]);
      setDataSgtePalet([]);
      setDataPorcentaje([]);
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
  }, [maquina, cultivo, fecha]);

  const handleCambioMaquina = (e) => setSeleccion(e.target.value);

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="mb-1 flex flex-col md:flex-row justify-end gap-2 sm:gap-4">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
        />

        <select
          onChange={(e) => setCultivo(e.target.value)}
          value={cultivo}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
        >
          <option value="ARANDANO">ARANDANO</option>
          <option value="Uva">UVA</option>
        </select>

        <select
          onChange={handleCambioMaquina}
          value={maquina}
          className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
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
        <div className="text-center py-4 text-sm sm:text-xl font-semibold text-red-600 mb-4">
          {error}
        </div>
      )}
      {/* Tabla kg proy vs ejec y sgte palet */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabla Línea Avance */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-1">
            <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
              KG PROY VS EJEC
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      VAR
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      PROY
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      EJEC
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataLineaVolcado.length > 0 ? (
                    dataLineaVolcado.map((row, index) => (
                      <tr
                        key={`lineaAvance-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                        } hover:bg-indigo-100`}
                      >
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.VAR || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.PROY || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.EJEC || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.PORCENTAJE || "N/A"} %
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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

        {/* Tabla Próximo Palet */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-1">
            <h2 className="text-center font-bold text-base sm:text-4xl text-black uppercase tracking-wider">
              SGTE PALET
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-teal-600 text-white">
                    <th className="px-4 py-2 text-center font-semibold text-sm sm:text-3xl uppercase">
                      PALET
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataSgtePalet.length > 0 ? (
                    dataSgtePalet.map((row, index) => (
                      <tr
                        key={`proximoPalet-${index}`}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-teal-50"
                        } hover:bg-teal-100`}
                      >
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-800 font-medium">
                          {row.PALET || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="1"
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
          <div>
            <div style={{ textAlign: "center", padding: "0px", margin: "0px" }}>
              <GaugeChart
                value={progressValue}
                colors={{
                  progress: progressValue > 80 ? "#4CAF50" : "#FFC107", // Verde si >80%, amarillo si no
                  needle: "#E91E63",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaEsperaArandano;
