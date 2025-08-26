import { useState, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import {
  fetchVariedad,
  fetchCabezal,
  fetchSedes,
  fetchCultivos,
} from "./utils/api";

// Lazy loading componentes
const Bienvenida = lazy(() => import("./components/Bienvenida"));
const Sidebar = lazy(() => import("./components/Sidebar"));

// Función para lazy loading dinámico de tablas
const getLazyTabla = (tablaName) => {
  switch (tablaName) {
    case "RECEPCIÓN":
      return lazy(() => import("./components/TablaRecepcion"));
    case "RECEPCION NISIRA":
      return lazy(() => import("./components/TablaRecepcionNisira"));
    case "RESUMEN RECEPCION ":
      return lazy(() => import("./components/TablaRecepcionResumen"));
    case "CALIDAD":
      return lazy(() => import("./components/TablaCalidad"));

    case "VOLCADO-MUESTRA":
      return lazy(() => import("./components/Nuevo"));
    case "GASIFICADO PRE FRÍO":
      return lazy(() => import("./components/TablaGasificado"));
    case "PUCHOS PT":
      return lazy(() => import("./components/TablaPuchosPT"));
    case "VOLCADO/ESPERA":
      return lazy(() => import("./components/TablaEspera"));
    case "VOLCADO/LÍNEA":
      return lazy(() => import("./components/TablaLineaVolcado"));
    case "FRIO":
      return lazy(() => import("./components/TablaFrio"));
    case "ORDEN PRD":
      return lazy(() => import("./components/TablaOrdenes"));

    default:
      return null;
  }
};

const endpointMap = { Arandano: { RECEPCIÓN: "recepcion" } };

const App = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [selectedOption] = useState("Arandano");
  const [selectedButton, setSelectedButton] = useState("RECEPCIÓN");
  const [data, setData] = useState([]);
  const [, setUltimaActualizacion] = useState(null);
  const intervaloRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packingExpanded, setPackingExpanded] = useState(true);
  const [expandedVolcado, setExpandedVolcado] = useState(false);

  const packingSections = [
    "RECEPCIÓN",
    "RECEPCION NISIRA",
    "RESUMEN RECEPCION ",
    "GASIFICADO PRE FRÍO",
    "PUCHOS PT",
    "CALIDAD",
    "VOLCADO-MUESTRA",
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

  const handleStart = () => setMostrarBienvenida(false);

  const cargarDatos = async () => {
    if (!selectedButton || !selectedOption) return;
    const endpoint = endpointMap[selectedOption]?.[selectedButton];
    if (!endpoint) return;

    try {
      let response;
      switch (endpoint) {
        case "recepcionAran":
          response = await fetchVariedad("funfo santa azul", "arandano");
          break;
        case "recepcionNisiraAran":
          response = await fetchCabezal("funfo santa azul", "arandano");
          break;
        case "sede":
          response = await fetchSedes();
          break;
        case "cultivo":
          response = await fetchCultivos();
          break;
        default:
          break;
      }
      if (response?.data) {
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

  useEffect(() => {
    const intervaloId = setInterval(cargarDatos, 8000);
    intervaloRef.current = intervaloId;
    cargarDatos();
    return () => clearInterval(intervaloId);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) cargarDatos();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const ComponenteTabla = useMemo(
    () => getLazyTabla(selectedButton),
    [selectedButton]
  );

  const renderTablas = () => {
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

    return (
      <Suspense
        fallback={<div className="text-center p-6">Cargando tabla...</div>}
      >
        <ComponenteTabla data={data} />
      </Suspense>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Suspense
        fallback={
          <div className="absolute left-0 top-0 p-4">Cargando menú...</div>
        }
      >
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
      </Suspense>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Suspense
          fallback={
            <div className="text-center p-6">Cargando bienvenida...</div>
          }
        >
          {mostrarBienvenida ? (
            <Bienvenida onStart={handleStart} />
          ) : (
            <main className="flex-1 overflow-y-auto p-2">{renderTablas()}</main>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default App;
