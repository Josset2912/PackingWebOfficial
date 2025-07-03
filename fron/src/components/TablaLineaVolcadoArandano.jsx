import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import GaugeChart from "./Medidor";

const TablaEsperaArandano = () => {
  /* ----------------------- estados ----------------------- */
  const [dataLineaVolcado, setDataLineaVolcado] = useState([]);
  const [dataSgtePalet, setDataSgtePalet] = useState([]);
  const [dataPorcentaje, setDataPorcentaje] = useState([]);
  const [progressValue, setProgressValue] = useState(0);

  const [maquina, setMaquina] = useState("UNITEC");
  const [dataMaquina, setDataMaquina] = useState([]);

  const [fruta, setFruta] = useState("ARANDANO");
  const [dataCultivo, setDataCultivo] = useState([]);

  const [sede, setSede] = useState("FUNDO SANTA AZUL");
  const [dataSedes, setDataSedes] = useState([]);

  const [turno, setTurno] = useState("TARDE");
  const [dataTurno, setDataTurno] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  /* ---------------------- fetchData ---------------------- */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const frutaParam = fruta.toLowerCase();
      const maquinaParam = maquina.toLowerCase();
      const sedeParam = sede.toLowerCase();
      const turnoParam = turno.toLowerCase();

      const [
        resLineaVolcado,
        resSgtePalet,
        resPorcentaje,
        resSedes,
        resCultivo,
        resMaquina,
        resTurno,
      ] = await Promise.all([
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: sedeParam,
            Cultivo: frutaParam,
            Turno: turnoParam,
            Maquina: maquinaParam,
            Id: 1,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: sedeParam,
            Cultivo: frutaParam,
            Turno: turnoParam,
            Maquina: maquinaParam,
            Id: 2,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/avanceLinea", {
          params: {
            Fecha: fecha,
            Sede: sedeParam,
            Cultivo: frutaParam,
            Turno: turnoParam,
            Maquina: maquinaParam,
            Id: 3,
          },
        }),
        axios.get("http://10.250.200.9:8650/api/sede", { params: { Emp: "" } }),
        axios.get("http://10.250.200.9:8650/api/cultivo"),
        axios.get("http://10.250.200.9:8650/api/maquina", {
          params: { Cultivo: frutaParam },
        }),
        axios.get("http://10.250.200.9:8650/api/turno"),
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
      setDataSedes(Array.isArray(resSedes.data) ? resSedes.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
      setDataMaquina(Array.isArray(resMaquina.data) ? resMaquina.data : []);
      setDataTurno(Array.isArray(resTurno.data) ? resTurno.data : []);

      const pct = parseFloat(resPorcentaje.data?.[0]?.PORCENTAJE);
      setProgressValue(!isNaN(pct) ? pct : 0);
    } catch (err) {
      console.error("Error en la carga:", err);

      setDataLineaVolcado([]);
      setDataSgtePalet([]);
      setDataPorcentaje([]);
      setDataCultivo([]);
      setDataSedes([]);
      setDataMaquina([]);
      setDataTurno([]);
    } finally {
      setLoading(false);
    }
  }, [fruta, sede, maquina, fecha, turno]); // << dependencias reales

  /* -------------- un sólo useEffect con intervalo -------- */
  const intervalRef = useRef(null);

  useEffect(() => {
    // 1️⃣  primer fetch inmediato
    fetchData();

    // 2️⃣  reinicia el intervalo si cambia algún filtro
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, 10_000);

    // 3️⃣  cleanup al desmontar
    return () => clearInterval(intervalRef.current);
  }, [fetchData]); // 🔑  depende del fetchData memoizado
  //
  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="mb-0.5 flex flex-wrap gap-1 justify-end items-center">
        {/* SEDE */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            SEDE:
          </label>
          <select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
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
            {dataCultivo.map((row, index) => (
              <option key={index} value={row.Cultivo}>
                {row.Cultivo}
              </option>
            ))}
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
              <option key={index} value={row.Maquina}>
                {row.Maquina}
              </option>
            ))}
          </select>
        </div>
        {/* TURNO */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className="font-bold text-sm sm:text-lg text-nowrap">
            TURNO:
          </label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-base font-bold text-green-800 rounded w-full"
          >
            {dataTurno.map((row, index) => (
              <option key={index} value={row.Turno}>
                {row.Turno}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <label className=" font-bold text-sm sm:text-lg text-nowrap    ">
            FECHA:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="p-1 border border-green-600 text-sm sm:text-xl font-bold text-green-800 rounded"
          />
        </div>
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
              KG PROG VS EJEC
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
                      PROG
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
                          {row.VAR || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.PROY || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.EJEC || "0"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm sm:text-3xl text-gray-700">
                          {row.PORCENTAJE || "0"} %
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
            <div
              style={{
                textAlign: "center",
                padding: "0px",
                margin: "0px",
                maxWidth: "300px", // Constrain width for better proportions
                // Center the chart
              }}
            >
              <GaugeChart
                value={progressValue}
                colors={{
                  progress: progressValue > 80 ? "#4CAF50" : "#FFC107", // Green if >80%, yellow otherwise
                  remaining: "#F5F5F5", // Lighter background
                  needle: "#E91E63", // Pink needle
                  text: progressValue > 80 ? "#4CAF50" : "#FFC107", // Match text color to progress
                  labelColor: "#757575", // Gray label
                }}
                label="Progress" // Add descriptive label
                fontSize="24px" // Slightly larger text
                thickness="65%" // Optimal thickness
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaEsperaArandano;
