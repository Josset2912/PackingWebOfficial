// config/tablas.js

// Importar todos los componentes de tabla para Arándano
import TablaRecepcionArandano from "../components/TablaRecepcionArandano";
import TablaGasificadoArandano from "../components/TablaGasificadoArandano";
import TablaEsperaArandano from "../components/TablaEsperaArandano";
import TablaFrioArandano from "../components/TablaFrioArandano";
import TablaOrdenesArandano from "../components/TablaOrdenesArandano";

// Importar todos los componentes de tabla para Uva
import TablaRecepcionUva from "../components/TablaRecepcionUva";
import TablaGasificadoUva from "../components/TablaGasificadoUva";
import TablaEsperaUva from "../components/TablaEsperaUva";
import TablaFrioUva from "../components/TablaFrioUva";
import TablaOrdenesUva from "../components/TablaOrdenesUva";

// Mapeo completo de componentes
export const tablaMap = {
  Arándano: {
    RECEPCIÓN: TablaRecepcionArandano,
    "GASIFICADO PRE FRÍO": TablaGasificadoArandano,
    ESPERA: TablaEsperaArandano,
    FRIO: TablaFrioArandano,
    "ORDEN PRD": TablaOrdenesArandano,
  },
  Uva: {
    RECEPCIÓN: TablaRecepcionUva,
    "GASIFICADO-VOLCADO": TablaGasificadoUva,
    ESPERA: TablaEsperaUva,
    FRIO: TablaFrioUva,
    "ORDEN PRD": TablaOrdenesUva,
  },
};

// Exportar tipos para autocompletado (TypeScript opcional)
export const seccionesDisponibles = {
  Arándano: Object.keys(tablaMap.Arándano),
  Uva: Object.keys(tablaMap.Uva),
};
