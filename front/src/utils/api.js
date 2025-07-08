// utils/api.js
// utils/api.js
import axios from "axios";

const BASE_URL = "http://190.119.200.124:45490";

//API CULTIVO
export const fetchCultivos = () => axios.get(`${BASE_URL}/packing/cultivo`);
//API SEDE
export const fetchSedes = () =>
  axios.get(`${BASE_URL}/packing/sede`, {
    params: { emp: "TODOS" },
  });
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

//API ESPERA
export const fetchEspera = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/espera`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API ESPERA LINEA
export const fetchEsperaLinea = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/esperaLinea`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API ESPERA FRIO
export const fetchEsperaFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/esperaFrio`, {
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

  return axios.get(`${BASE_URL}/packing/batchEnfriando`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API ORDENES
export const fetchOrdenes = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${BASE_URL}/packing/ordenes`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};
export default {
  fetchCultivos,
  fetchSedes,
  fetchVariedad,
  fetchCabezal,
  fetchVariedadNisira,
  fetchCabezalNisira,
  fetchEsperaGasificado,
  fetchEsperaBatchGasificado,
  fetchEsperaPreFrio,
  fetchBatchPreFrio,
  fetchEspera,
  fetchEsperaLinea,
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
