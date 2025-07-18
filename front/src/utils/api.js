// utils/api.js
// utils/api.js
import axios from "axios";

//=======================================================
const BASE_URL = "http://190.119.200.124:45490";
//=======================================================
//API CLUNCH
export const fetchPresentacion = (sede, cultivo, maquina, filer) => {
  const sedeValido = sede?.trim() || "TODOS"; // Ajusta según tu lógica
  const cultivoValido = cultivo?.trim() || "ARANDANO";
  const maquinaValida = maquina?.trim() || "SELECCIONE";
  const lineaValida = filer?.trim() || "SELECCIONE";
  return axios.get(`${BASE_URL}/packing/presentacion`, {
    params: {
      sede: sedeValido,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      filer: lineaValida,
    },
  });
};
//API TURNO
export const fetchTurno = () =>
  axios.get(`${BASE_URL}/packing/turno`, {
    params: { turno: "" },
  });

//API CULTIVO
export const fetchCultivos = () => axios.get(`${BASE_URL}/packing/cultivo`);
//API SEDE
export const fetchSedes = () =>
  axios.get(`${BASE_URL}/packing/sede`, {
    params: { emp: "TODOS" },
  });
//API MAQUINA
export const fetchMaquina = (cultivo) => {
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/maquina`, {
    params: { cultivo: cultivoValido },
  });
};
//API FILTER-FILTRO
export const fetchFiler = (maquina) => {
  const maquinaValida = maquina?.trim() || "UNITEC";
  return axios.get(`${BASE_URL}/packing/filer`, {
    params: { maquina: maquinaValida },
  });
};
//=====================================
//API  RECPECION VARIEDAD
export const fetchVariedad = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/recepcion`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 1 },
  });
};
//API RECPECION CABEZAL
export const fetchCabezal = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/recepcion`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};
//=====================================
//API VARIEDAD NISIRA
export const fetchVariedadNisira = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/recepcionNisira`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 1 },
  });
};
//API CABEZAL NISIRA
export const fetchCabezalNisira = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/recepcionNisira`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};
//=====================================
//API CALIDAD VARIEDAD
export const fetchCalidad = (sede, cultivo, maquina, linea, presentacion) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";

  return axios.get(`${BASE_URL}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      id: 1,
    },
  });
};
//API CALIDAD CABEZAL NISIRA
export const fetchCalidadRango = (
  sede,
  cultivo,
  maquina,
  linea,
  presentacion
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";

  return axios.get(`${BASE_URL}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      id: 2,
    },
  });
};
//API CALIDAD RANGO FILER
export const fetchCalidadRangoFiler = (
  sede,
  cultivo,
  maquina,
  linea,
  presentacion
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";

  return axios.get(`${BASE_URL}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      id: 3, // 
    },
  });
};
//API CALIDAD RANGO FILER
export const fetchCalidadPorcentajeMuestras = (
  sede,
  cultivo,
  maquina,
  linea,
  presentacion
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";

  return axios.get(`${BASE_URL}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      id: 4, // 
    },
  });
};

//===========================//

//API  ESPERA GASIFICADO
export const fetchEsperaGasificado = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/gasificado`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API ESPERA BATCH GASIFICADO
export const fetchEsperaBatchGasificado = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/gasificadoBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API  ESPERA ESPERA PRE FRIO
export const fetchEsperaPreFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/prefrio`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API BATCH PRE FRIO
export const fetchBatchPreFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/prefrioBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//===========================//
//API ESPERA VOLCADO
export const fetchEspera = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/esperavolcado`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//API  VOLCADO LINEA
export const fetchEsperaLineaProg = (fecha, sede, cultivo, turno, maquina) => {
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const turnoValido = turno?.trim() || "TARDE";
  const maquinaValida = maquina?.trim() || "UNITEC";

  return axios.get(`${BASE_URL}/packing/esperalinea`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      turno: turnoValido,
      maquina: maquinaValida,
      id: 1,
    },
  });
};

export const fetchEsperaLineaSgtePalet = (
  fecha,
  sede,
  cultivo,
  turno,
  maquina
) => {
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const turnoValido = turno?.trim() || "TARDE";
  const maquinaValida = maquina?.trim() || "UNITEC";

  return axios.get(`${BASE_URL}/packing/esperalinea`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      turno: turnoValido,
      maquina: maquinaValida,
      id: 2,
    },
  });
};

export const fetchEsperaLineaPorcentaje = (
  fecha,
  sede,
  cultivo,
  turno,
  maquina
) => {
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const turnoValido = turno?.trim() || "TARDE";
  const maquinaValida = maquina?.trim() || "UNITEC";

  return axios.get(`${BASE_URL}/packing/esperalinea`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      turno: turnoValido,
      maquina: maquinaValida,
      id: 3,
    },
  });
};

export const fetchEsperaLineaRatio = (fecha, sede, cultivo, turno, maquina) => {
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const turnoValido = turno?.trim() || "TARDE";
  const maquinaValida = maquina?.trim() || "UNITEC";

  return axios.get(`${BASE_URL}/packing/esperalinea`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      turno: turnoValido,
      maquina: maquinaValida,
      id: 4,
    },
  });
};

//==============================//
//API ESPERA FRIO
export const fetchEsperaFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/esperafrio`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API ENFRIANDO
export const fetchEnfriando = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/enfriando`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API BATCH ENFRIANDO
export const fetchBatchEnfriando = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/enfriandoBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//===========================//

//API ORDENES
export const fetchOrdenes = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/ordenesPRD`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
export default {
  fetchPresentacion,
  fetchFiler,
  fetchTurno,
  fetchCultivos,
  fetchSedes,
  fetchMaquina,
  fetchVariedad,
  fetchCabezal,
  fetchVariedadNisira,
  fetchCabezalNisira,
  fetchCalidad,
  fetchCalidadRangoFiler,
  fetchCalidadRango,
  fetchCalidadPorcentajeMuestras,
  fetchEsperaGasificado,
  fetchEsperaBatchGasificado,
  fetchEsperaPreFrio,
  fetchBatchPreFrio,
  fetchEspera,
  fetchEsperaLineaProg,
  fetchEsperaLineaSgtePalet,
  fetchEsperaLineaPorcentaje,
  fetchEsperaLineaRatio,
  fetchEsperaFrio,
  fetchEnfriando,
  fetchBatchEnfriando,
  fetchOrdenes,
};

//const isLocalhost = window.location.hostname === "10.51.51.15";

//const baseURL = "5000";
// desarrollo local
//const baseURL = "http://10.51.51.15:8643";
//const baseURL = "http://10.250.200.9 :8643"; // producción en IIS con tu IP y puerto `${baseURL}/api/${endpoint}`
/* 
const BASE_URL = "http://10.250.200.9:8650/api/";
/* const BASE_URL = "http://10.250.200.9 :8650/api/"; */

/* export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error;
  }
};
 */
{
  /*
    
    export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://10.250.200.9 :8643/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error;
  }
};
    
    
    */
}

{
  /* 
    
    export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3001/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json(); // Devuelve los datos directamente
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};

    
    */
}
