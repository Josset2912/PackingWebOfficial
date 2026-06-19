// utils/api.js
import axios from "axios";
import NProgress from "nprogress";

//=======================================================
let baseUrl = import.meta.env.VITE_API_URL;
const fallbackUrl = import.meta.env.VITE_FALLBACK_URL;

// Contador de peticiones activas
let activeRequests = 0;

// Interceptor de peticiones: inicia NProgress solo si no está marcado para ocultarlo
axios.interceptors.request.use(
    (config) => {
        // Si la petición tiene hideProgressBar: true, no mostrar la barra
        if (!config.hideProgressBar) {
            activeRequests++;
            if (activeRequests === 1) {
                NProgress.start();
            }
        }
        return config;
    },
    (error) => {
        if (!error.config?.hideProgressBar) {
            activeRequests--;
            if (activeRequests === 0) {
                NProgress.done();
            }
        }
        return Promise.reject(error);
    }
);

// Interceptor de respuestas: completa NProgress
axios.interceptors.response.use(
    (response) => {
        if (!response.config?.hideProgressBar) {
            activeRequests--;
            if (activeRequests === 0) {
                NProgress.done();
            }
        }
        return response;
    },
    (error) => {
        if (!error.config?.hideProgressBar) {
            activeRequests--;
            if (activeRequests === 0) {
                NProgress.done();
            }
        }
        return Promise.reject(error);
    }
);

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
export const fetchEmpaqFiltro = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/maestros/empaque`, {
        params: {},
        hideProgressBar,
    });
//API VARIEDAD
export const fetchVariedadFiltro = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/maestros/variedad`, {
        params: {},
        hideProgressBar,
    });

//API PRESENTACION
export const fetchPresentacion = (
    sede,
    cultivo,
    maquina,
    filer,
    fecha,
    hideProgressBar = false
) => {
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
        hideProgressBar,
    });
};
//API TURNO
export const fetchTurno = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/packing/turno`, {
        params: { turno: "" },
        hideProgressBar,
    });

//API CULTIVO
export const fetchCultivos = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/packing/cultivo`, { hideProgressBar });
//API EMPRESA
export const fetchEmpresa = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/maestros/empresa`, { hideProgressBar });
//API SEDE
export const fetchSedes = (hideProgressBar = false) =>
    axios.get(`${baseUrl}/packing/sede`, {
        params: { emp: "TODOS" },
        hideProgressBar,
    });
//API MAQUINA
export const fetchMaquina = (cultivo, hideProgressBar = false) => {
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/maquina`, {
        params: { cultivo: cultivoValido },
        hideProgressBar,
    });
};
//API FILTER-FILTRO
export const fetchFiler = (maquina, hideProgressBar = false) => {
    const maquinaValida = maquina?.trim() || "UNITEC";
    return axios.get(`${baseUrl}/packing/filer`, {
        params: { maquina: maquinaValida },
        hideProgressBar,
    });
};
//=====================================
//API  RECPECION VARIEDAD
export const fetchVariedad = (
    sede,
    cultivo,
    empaque,
    variedad,
    hideProgressBar = false
) => {
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
        hideProgressBar,
    });
};
//API RECPECION CABEZAL
export const fetchCabezal = (
    sede,
    cultivo,
    empaque,
    variedad,
    hideProgressBar = false
) => {
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
        hideProgressBar,
    });
};
//=====================================
//API VARIEDAD NISIRA
export const fetchVariedadNisira = (
    sede,
    cultivo,
    empaque,
    variedad,
    hideProgressBar = false
) => {
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
        hideProgressBar,
    });
};
//API CABEZAL NISIRA
export const fetchCabezalNisira = (
    sede,
    cultivo,
    empaque,
    variedad,
    hideProgressBar = false
) => {
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
        hideProgressBar,
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
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
};
//API CALIDAD CABEZAL NISIRA
export const fetchCalidadRango = (
    sede,
    cultivo,
    maquina,
    linea,
    presentacion,
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
};
//API CALIDAD RANGO FILER
export const fetchCalidadRangoFiler = (
    sede,
    cultivo,
    maquina,
    linea,
    presentacion,
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
};
//API CALIDAD RANGO FILER
export const fetchCalidadPorcentajeMuestras = (
    sede,
    cultivo,
    maquina,
    linea,
    presentacion,
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
};

//===========================//

//API  ESPERA GASIFICADO
export const fetchEsperaGasificado = (
    sede,
    cultivo,
    hideProgressBar = false
) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/gasificado`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};

//API ESPERA BATCH GASIFICADO
export const fetchEsperaBatchGasificado = (
    sede,
    cultivo,
    hideProgressBar = false
) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/gasificadoBatch`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};

//API  ESPERA ESPERA PRE FRIO
export const fetchEsperaPreFrio = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/prefrio`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};

//API BATCH PRE FRIO
export const fetchBatchPreFrio = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/prefrioBatch`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};
//===========================//
//API ESPERA VOLCADO
export const fetchEspera = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/esperavolcado`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};
//API  VOLCADO LINEA
export const fetchEsperaLineaProg = (
    fecha,
    sede,
    cultivo,
    turno,
    maquina,
    hideProgressBar = false
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
            id: 1,
        },
        hideProgressBar,
    });
};

export const fetchEsperaLineaSgtePalet = (
    fecha,
    sede,
    cultivo,
    turno,
    maquina,
    hideProgressBar = false
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
        hideProgressBar,
    });
};

export const fetchEsperaLineaPorcentaje = (
    fecha,
    sede,
    cultivo,
    turno,
    maquina,
    hideProgressBar = false
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
        hideProgressBar,
    });
};

export const fetchEsperaLineaRatio = (
    fecha,
    sede,
    cultivo,
    turno,
    maquina,
    hideProgressBar = false
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
            id: 4,
        },
        hideProgressBar,
    });
};

export const fetchEsperaLineaTnTotal = (
    fecha,
    sede,
    cultivo,
    turno,
    maquina,
    hideProgressBar = false
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
        hideProgressBar,
    });
};

//==============================//
//API ESPERA FRIO
export const fetchEsperaFrio = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/esperafrio`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
        hideProgressBar,
    });
};

//API ENFRIANDO
export const fetchEnfriando = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/enfriando`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido, id: 2 },
        hideProgressBar,
    });
};

//API BATCH ENFRIANDO
export const fetchBatchEnfriando = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/enfriandoBatch`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};
//===========================//

//API ORDENES
export const fetchOrdenes = (sede, cultivo, hideProgressBar = false) => {
    const sedeValida = sede?.trim() || "todos";
    const cultivoValido = cultivo?.trim() || "arandano";

    return axios.get(`${baseUrl}/packing/ordenesPRD`, {
        params: { cod: "1", sede: sedeValida, cultivo: cultivoValido },
        hideProgressBar,
    });
};
//==================================
//FETCH RECEPCION RESUMEN
export const fetchRecepcionResumen = (
    sede,
    cultivo,
    empaque,
    variedad,
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
};

export function fetchRecepcionVariedad(
    sede,
    cultivo,
    empaque,
    variedad,
    fecha,
    hideProgressBar = false
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
        hideProgressBar,
    });
}

export function fetchRecepcionRango(
    sede,
    cultivo,
    empaque,
    variedad,
    fecha,
    hideProgressBar = false
) {
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
        hideProgressBar,
    });
}
//PUCHOS PT
export function fetchPuchosPT(fecha, sede, cultivo, hideProgressBar = false) {
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
        hideProgressBar,
    });
}

export function fetchPuchosPTGrafico(
    fecha,
    sede,
    cultivo,
    hideProgressBar = false
) {
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
        hideProgressBar,
    });
}

//=============================================
//FETCH PULMON

export function fetchTablaPulmon(
    cultivo,
    maquina,
    fecha,
    hideProgressBar = false
) {
    // ✅ valor válido por defecto
    const cultivoValido = cultivo?.trim() || "arandano";
    const maquinaValida = maquina?.trim() || "unitec"; // evitar "SELECCIONE"
    const fechaValida = fecha?.trim() || new Date().toLocaleDateString("en-CA");

    return axios.get(`${baseUrl}/packing/tablapulmon`, {
        params: {
            cultivo: cultivoValido, // 👈 parámetro correcto
            maquina: maquinaValida,
            fecha: fechaValida,
        },
        hideProgressBar,
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


