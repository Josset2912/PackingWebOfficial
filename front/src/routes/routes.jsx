// src/routes/routes.jsx
export const ROUTES = {
  HOME: "/",
  RECEPCION: "/recepcion",
  RECEPCION_NISIRA: "/recepcion-nisira",
  RESUMEN_RECEPCION: "/resumen-recepcion",
  GASIFICADO: "/gasificado-pre-frio",
  PUCHOS_PT: "/puchos-pt",
  CALIDAD: "/calidad",
  VOLCADO_MUESTRA: "/volcado-muestra",
  VOLCADO_ESPERA: "/volcado/espera",
  VOLCADO_LINEA: "/volcado/linea",
  FRIO: "/frio",
  ORDEN_PRD: "/orden-prd",
};

// Mapeo de nombres de secciones a rutas
export const getSectionRoute = (sectionName) => {
  const routeMap = {
    "RECEPCIÓN": ROUTES.RECEPCION,
    "RECEPCION NISIRA": ROUTES.RECEPCION_NISIRA,
    "RESUMEN RECEPCION ": ROUTES.RESUMEN_RECEPCION,
    "GASIFICADO PRE FRÍO": ROUTES.GASIFICADO,
    "PUCHOS PT": ROUTES.PUCHOS_PT,
    "CALIDAD": ROUTES.CALIDAD,
    "VOLCADO-MUESTRA": ROUTES.VOLCADO_MUESTRA,
    "VOLCADO/ESPERA": ROUTES.VOLCADO_ESPERA,
    "VOLCADO/LÍNEA": ROUTES.VOLCADO_LINEA,
    "FRIO": ROUTES.FRIO,
    "ORDEN PRD": ROUTES.ORDEN_PRD,
  };
  return routeMap[sectionName] || ROUTES.HOME;
};

// Mapeo inverso: de ruta a nombre de sección
export const getRouteSection = (pathname) => {
  const sectionMap = {
    [ROUTES.HOME]: null,
    [ROUTES.RECEPCION]: "RECEPCIÓN",
    [ROUTES.RECEPCION_NISIRA]: "RECEPCION NISIRA",
    [ROUTES.RESUMEN_RECEPCION]: "RESUMEN RECEPCION ",
    [ROUTES.GASIFICADO]: "GASIFICADO PRE FRÍO",
    [ROUTES.PUCHOS_PT]: "PUCHOS PT",
    [ROUTES.CALIDAD]: "CALIDAD",
    [ROUTES.VOLCADO_MUESTRA]: "VOLCADO-MUESTRA",
    [ROUTES.VOLCADO_ESPERA]: "VOLCADO/ESPERA",
    [ROUTES.VOLCADO_LINEA]: "VOLCADO/LÍNEA",
    [ROUTES.FRIO]: "FRIO",
    [ROUTES.ORDEN_PRD]: "ORDEN PRD",
  };
  return sectionMap[pathname];
};
