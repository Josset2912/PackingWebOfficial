import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Bienvenida from "./components/Bienvenida";
import Header from "./components/Header";
import {
  fetchVariedad,
  fetchCabezal,
  fetchSedes,
  fetchCultivos,
} from "./utils/api"; // Importar función de API
import Sidebar from "./components/Sidebar";

// Componentes para Arándano
import TablaRecepcion from "./components/TablaRecepcion";
import TablaRecepcionNisira from "./components/TablaRecepcionNisira";
import TablaGasificado from "./components/TablaGasificado";
import TablaCalidad from "./components/TablaCalidad"; // Asumiendo que TablaCalidad es genérica
import TablaEspera from "./components/TablaEspera";
import TablaLineaVolcado from "./components/TablaLineaVolcado";
import TablaFrio from "./components/TablaFrio";
import TablaOrdenes from "./components/TablaOrdenes";
import TablaTacometro from "./components/TablaRecepcionResumen"; // Importar TablaTacometro
// Mapeo de endpoints actualizado
const endpointMap = {
  Arandano: {
    RECEPCIÓN: "recepcion",
    // otros endpoints...
  },
};

// Mapeo de componentes de tabla actualizado
const tablaMap = {
  Arandano: {
    RECEPCIÓN: TablaRecepcion,
    "RECEPCION NISIRA": TablaRecepcionNisira,
    "RESUMEN RECEPCION ": TablaTacometro, // Agregar TablaTacometro
    CALIDAD: TablaCalidad, // Asumiendo que la tabla de calidad es la misma que recepción
    "GASIFICADO PRE FRÍO": TablaGasificado,
    "VOLCADO/ESPERA": TablaEspera,
    "VOLCADO/LÍNEA": TablaLineaVolcado,
    FRIO: TablaFrio,
    "ORDEN PRD": TablaOrdenes,
  },
};

const App = () => {
  // Estados
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [selectedOption] = useState("Arandano");
  const [selectedButton, setSelectedButton] = useState("RECEPCIÓN");
  const [data, setData] = useState([]);
  const [, setUltimaActualizacion] = useState(null);
  const intervaloRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packingExpanded, setPackingExpanded] = useState(true);
  const [expandedVolcado, setExpandedVolcado] = useState(false);

  // Secciones de packing con estructura jerárquica
  const packingSections = [
    "RECEPCIÓN",
    "RECEPCION NISIRA",
    "RESUMEN RECEPCION ",
    "GASIFICADO PRE FRÍO",
    "CALIDAD",
    {
      name: "VOLCADO",
      submenus: [
        { name: "ESPERA", key: "VOLCADO/ESPERA" },
        { name: "LÍNEA", key: "VOLCADO/LÍNEA" },
      ],
    },
    "FRIO",
    "ORDEN PRD",
  ];

  const handleStart = () => {
    setMostrarBienvenida(false);
  };

  // Función para cargar datos
  const cargarDatos = async () => {
    if (!selectedButton || !selectedOption) return;

    const endpoint = endpointMap[selectedOption]?.[selectedButton];
    if (!endpoint) return;

    try {
      let response;
      switch (endpoint) {
        case "recepcionAran":
          // Por ejemplo, puedes llamar fetchVariedad o fetchCabezal según selectedButton
          // Aquí deberías adaptar según lo que quieres obtener realmente
          response = await fetchVariedad("funfo santa azul", "arandano");
          break;
        case "recepcionNisiraAran":
          // Similar para otras llamadas
          response = await fetchCabezal("funfo santa azul", "arandano");
          break;
        case "sede":
          response = await fetchSedes();
          break;
        case "cultivo":
          response = await fetchCultivos();
          break;
        default:
          // Podrías hacer axios directo o manejar otros endpoints
          break;
      }
      if (response && response.data) {
        setData((prevData) => {
          if (JSON.stringify(prevData) !== JSON.stringify(response.data)) {
            setUltimaActualizacion(new Date());
            return response.data;
          }
          return prevData;
        });
      }
    } catch (error) {
      console.error(`Error cargando datos de ${endpoint}:`, error);
    }
  };

  // Configurar intervalo de actualización
  useEffect(() => {
    const manejarActualizacion = () => cargarDatos();
    const intervaloId = setInterval(manejarActualizacion, 8000);
    intervaloRef.current = intervaloId;
    cargarDatos();
    return () => clearInterval(intervaloId);
  }, []);

  // Actualizar al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) cargarDatos();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  // Render de tablas
  const renderTablas = () => {
    const ComponenteTabla = tablaMap[selectedOption]?.[selectedButton];

    if (!ComponenteTabla) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Selecciona una sección
            </h3>
            <p className="mt-1 text-gray-500">
              Elige una sección del menú Packing para ver las tablas
            </p>
          </div>
        </div>
      );
    }

    return <ComponenteTabla data={data} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        packingExpanded={packingExpanded}
        setPackingExpanded={setPackingExpanded}
        expandedVolcado={expandedVolcado}
        setExpandedVolcado={setExpandedVolcado}
        packingSections={packingSections}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />

      {/* Main Content */}
      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {mostrarBienvenida ? (
          <Bienvenida onStart={handleStart} />
        ) : (
          <>
            {/* Main con scroll funcional */}
            <main className="flex-1 overflow-y-auto p-2">{renderTablas()}</main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
