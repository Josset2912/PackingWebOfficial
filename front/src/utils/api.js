// utils/api.js
// utils/api.js
import axios from "axios";

//=======================================================
let baseUrl = "http://190.119.200.124:45490";
const fallbackUrl = "http://181.66.254.221:45490";

(async () => {
  try {
    await axios.get(`${baseUrl}/maestros/empaque`, { timeout: 5000 });
  } catch (error) {
    console.log(
      "Primary URL not responding, switching to fallback:",
      error.message
    );
    baseUrl = fallbackUrl;
  }
})();
//=======================================================
//API EMPAQUE
export const fetchEmpaqFiltro = () =>
  axios.get(`${baseUrl}/maestros/empaque`, {
    params: {},
  });
//API VARIEDAD
export const fetchVariedadFiltro = () =>
  axios.get(`${baseUrl}/maestros/variedad`, {
    params: {},
  });

//API CLUNCH
export const fetchPresentacion = (sede, cultivo, maquina, filer) => {
  const sedeValido = sede?.trim() || "TODOS"; // Ajusta según tu lógica
  const cultivoValido = cultivo?.trim() || "ARANDANO";
  const maquinaValida = maquina?.trim() || "SELECCIONE";
  const lineaValida = filer?.trim() || "SELECCIONE";
  return axios.get(`${baseUrl}/packing/presentacion`, {
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
  axios.get(`${baseUrl}/packing/turno`, {
    params: { turno: "" },
  });

//API CULTIVO
export const fetchCultivos = () => axios.get(`${baseUrl}/packing/cultivo`);
//API SEDE
export const fetchEmpresa = () => axios.get(`${baseUrl}/maestros/empresa`);
//API SEDE
export const fetchSedes = () =>
  axios.get(`${baseUrl}/packing/sede`, {
    params: { emp: "TODOS" },
  });
//API MAQUINA
export const fetchMaquina = (cultivo) => {
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/maquina`, {
    params: { cultivo: cultivoValido },
  });
};
//API FILTER-FILTRO
export const fetchFiler = (maquina) => {
  const maquinaValida = maquina?.trim() || "UNITEC";
  return axios.get(`${baseUrl}/packing/filer`, {
    params: { maquina: maquinaValida },
  });
};
//=====================================
//API  RECPECION VARIEDAD
export const fetchVariedad = (sede, cultivo, empaque, variedad) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "TODOS";
  const variedadValida = variedad?.trim() || "TODOS";

  return axios.get(`${baseUrl}/packing/recepcion`, {
    params: {
      cod: "1",
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      id: 1,
    },
  });
};
//API RECPECION CABEZAL
export const fetchCabezal = (sede, cultivo, empaque, variedad) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "TODOS";
  const variedadValida = variedad?.trim() || "TODOS";

  return axios.get(`${baseUrl}/packing/recepcion`, {
    params: {
      cod: "1",
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      id: 2,
    },
  });
};
//=====================================
//API VARIEDAD NISIRA
export const fetchVariedadNisira = (sede, cultivo, empaque, variedad) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "todos";
  const variedadValida = variedad?.trim() || "todos";

  return axios.get(`${baseUrl}/packing/recepcionNisira`, {
    params: {
      cod: "1",
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      id: 1,
    },
  });
};
//API CABEZAL NISIRA
export const fetchCabezalNisira = (sede, cultivo, empaque, variedad) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "todos";
  const variedadValida = variedad?.trim() || "todos";

  return axios.get(`${baseUrl}/packing/recepcionNisira`, {
    params: {
      cod: "1",
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      id: 2,
    },
  });
};
//=====================================
//API CALIDAD VARIEDAD
export const fetchCalidad = (
  sede,
  cultivo,
  maquina,
  linea,
  presentacion,
  fecha
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      fecha: fechaValida,
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
  presentacion,
  fecha
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      fecha: fechaValida,
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
  presentacion,
  fecha
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      fecha: fechaValida,
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
  presentacion,
  fecha
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "UNITEC";
  const lineaValida = linea?.trim() || "F1";
  const presentacionValida = presentacion?.trim() || "SELECCIONE";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  return axios.get(`${baseUrl}/packing/calidad`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      maquina: maquinaValida,
      linea: lineaValida,
      presentacion: presentacionValida,
      fecha: fechaValida,
      id: 4, //
    },
  });
};

//===========================//

//API  ESPERA GASIFICADO
export const fetchEsperaGasificado = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/gasificado`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API ESPERA BATCH GASIFICADO
export const fetchEsperaBatchGasificado = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/gasificadoBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API  ESPERA ESPERA PRE FRIO
export const fetchEsperaPreFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/prefrio`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};

//API BATCH PRE FRIO
export const fetchBatchPreFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/prefrioBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//===========================//
//API ESPERA VOLCADO
export const fetchEspera = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/esperavolcado`, {
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

  return axios.get(`${baseUrl}/packing/esperalinea`, {
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

  return axios.get(`${baseUrl}/packing/esperalinea`, {
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

  return axios.get(`${baseUrl}/packing/esperalinea`, {
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

  return axios.get(`${baseUrl}/packing/esperalinea`, {
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

export const fetchEsperaLineaTnTotal = (
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

  return axios.get(`${baseUrl}/packing/esperalinea`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      turno: turnoValido,
      maquina: maquinaValida,
      id: 5,
    },
  });
};

//==============================//
//API ESPERA FRIO
export const fetchEsperaFrio = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/esperafrio`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API ENFRIANDO
export const fetchEnfriando = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/enfriando`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
  });
};

//API BATCH ENFRIANDO
export const fetchBatchEnfriando = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/enfriandoBatch`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//===========================//

//API ORDENES
export const fetchOrdenes = (sede, cultivo) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";

  return axios.get(`${baseUrl}/packing/ordenesPRD`, {
    params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
  });
};
//==================================
//FETCH RECEPCION RESUMEN
export const fetchRecepcionResumen = (
  sede,
  cultivo,
  empaque,
  variedad,
  fecha
) => {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "todos";
  const variedadValida = variedad?.trim() || "todos";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/resumenrecepcion`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      fecha: fechaValida,
      id: "1",
    },
  });
};

export function fetchRecepcionVariedad(
  sede,
  cultivo,
  empaque,
  variedad,
  fecha
) {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "todos";
  const variedadValida = variedad?.trim() || "todos";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/resumenrecepcion`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      fecha: fechaValida,
      id: "2",
    },
  });
}

export function fetchRecepcionRango(sede, cultivo, empaque, variedad, fecha) {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const empaqueValido = empaque?.trim() || "todos";
  const variedadValida = variedad?.trim() || "todos";
  const fechaValida = fecha?.trim() || new Date().toLocaleDateString("en-CA");

  return axios.get(`${baseUrl}/packing/resumenrecepcion`, {
    params: {
      sede: sedeValida,
      cultivo: cultivoValido,
      empaque: empaqueValido,
      variedad: variedadValida,
      fecha: fechaValida,
      id: "3",
    },
  });
}
//PUCHOS PT
export function fetchPuchosPT(fecha, sede, cultivo) {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/puchospt`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      cod: "1",
    },
  });
}

export function fetchPuchosPTGrafico(fecha, sede, cultivo) {
  const sedeValida = sede?.trim() || "todos";
  const cultivoValido = cultivo?.trim() || "arandano";
  const fechaValida = fecha?.trim() || new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  return axios.get(`${baseUrl}/packing/puchospt`, {
    params: {
      fecha: fechaValida,
      sede: sedeValida,
      cultivo: cultivoValido,
      cod: "2",
    },
  });
}

//=============================================
//FETCH PULMON

export function fetchTablaPulmon(cultivo, maquina, fecha) {
  // ✅ valor válido por defecto
  const cultivoValido = cultivo?.trim() || "arandano";
  const maquinaValida = maquina?.trim() || "unitec"; // evitar "SELECCIONE"
  const fechaValida = fecha?.trim() || new Date().toLocaleDateString("en-CA");

  // ✅ función que convierte YYYY-MM-DD → DD-MM-YY
  /* function formatFecha(fechaISO) {
    if (!fechaISO) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear().toString().slice(-2);
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      return `${dd}-${mm}-${yyyy}`; // ejemplo: 09-09-25
    }
    const [year, month, day] = fechaISO.split("-");
    return `${day}-${month}-${year.slice(-2)}`; // ejemplo: 09-09-25
  }

  const fechaValida = formatFecha(fecha); */

  return axios.get(`${baseUrl}/packing/tablapulmon`, {
    params: {
      cultivo: cultivoValido, // 👈 parámetro correcto
      maquina: maquinaValida,
      fecha: fechaValida,
    },
  });
}

//=============================//
//EXPORTANDO FETCH'S
export default {
  fetchEmpresa,
  fetchEmpaqFiltro,
  fetchVariedadFiltro,
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
  fetchEsperaLineaTnTotal,
  fetchEsperaFrio,
  fetchEnfriando,
  fetchBatchEnfriando,
  fetchOrdenes,
  fetchRecepcionResumen,
  fetchRecepcionVariedad,
  fetchRecepcionRango,
  fetchPuchosPT,
  fetchPuchosPTGrafico,
  fetchTablaPulmon,
};

//const isLocalhost = window.location.hostname === "10.51.51.15";

//const baseURL = "5000";
// desarrollo local
//const baseURL = "http://10.51.51.15:8643";
//const baseURL = "http://10.250.200.9 :8643"; // producción en IIS con tu IP y puerto `${baseURL}/api/${endpoint}`
/* 
const baseUrl = "http://10.250.200.9:8650/api/";
/* const baseUrl = "http://10.250.200.9 :8650/api/"; */

/* export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
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
