import React, { useState, useEffect } from "react";

import {
  fetchCultivos,
  fetchSedes,
  fetchVariedad,
  fetchCabezal,
} from "../utils/api";

const TablaRecepcionArandano = (datos) => {
  // Estados para filtros
  const [fruta, setFruta] = useState("ARANDANO");
  const [sede, setSede] = useState("TODOS");

  // Datos obtenidos de APIs
  const [dataCultivo, setDataCultivo] = useState([]);
  const [dataSedes, setDataSedes] = useState([]);
  // Función para cargar todos los datos
  const fetchData = async () => {
    try {
      // Convertir valores a minúsculas para la API si lo requiere
      const frutaLower = fruta.toLowerCase();
      const sedeParam = sede === "TODOS" ? "" : sede;

      // Llamadas paralelas
      const [resSede, resCultivo] = await Promise.all([
        fetchVariedad(sedeParam, frutaLower),
        fetchCabezal(sedeParam, frutaLower),
        fetchSedes(),
        fetchCultivos(),
      ]);
      // Verificar si las respuestas son válidas y asignar los datos
      // si no, asignar un array vacío

      // Las respuestas de axios ya traen el objeto data
      setDataSedes(Array.isArray(resSede.data) ? resSede.data : []);
      setDataCultivo(Array.isArray(resCultivo.data) ? resCultivo.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDataSedes([]);
      setDataCultivo([]);
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

  const {
    muestras = 0,
    promedio = 0,
    conforme = "0%",
    bajoPeso = "0%",
    sobrepeso = "0%",
  } = datos;

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

      <div className="flex-1 overflow-x-auto rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] px-4 py-6 bg-gradient-to-b from-cyan-100 to-green-100 rounded-xl border-2 border-blue-500 shadow-md">
          <h2 className="text-center text-white bg-blue-600 font-bold py-2 rounded-md text-xl sm:text-3xl mb-6">
            RESULTADO DE MUESTRAS
          </h2>

          {/* Primera fila horizontal */}
          <div className="grid grid-cols-2 gap-4 text-center text-xl sm:text-2xl font-semibold mb-8">
            <div>
              <p className="text-gray-700 uppercase">Número Muestras</p>
              <p className="text-black text-3xl font-bold">{muestras}</p>
            </div>
            <div>
              <p className="text-gray-700 uppercase">Promedio</p>
              <p className="text-black text-3xl font-bold">{promedio}</p>
            </div>
          </div>

          {/* Métricas verticales distribuidas */}
          <div className="text-center space-y-6">
            <div>
              <p className="text-gray-600 text-xl font-semibold uppercase">
                % Conforme
              </p>
              <p className="text-3xl text-black font-bold">{conforme}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xl font-semibold uppercase">
                % Bajo Peso
              </p>
              <p className="text-3xl text-black font-bold">{bajoPeso}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xl font-semibold uppercase">
                % Sobrepeso
              </p>
              <p className="text-3xl text-black font-bold">{sobrepeso}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaRecepcionArandano;
