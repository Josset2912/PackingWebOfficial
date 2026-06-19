import {
    useState,
    useEffect,
    useRef,
    lazy,
    Suspense,
    useMemo,
    useCallback,
    memo,
} from "react";
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate,
} from "react-router-dom";
import { ROUTES, getRouteSection } from "./routes/routes";
import {
    fetchVariedad,
    fetchCabezal,
    fetchSedes,
    fetchCultivos,
} from "./utils/api";
import { createTheme, ThemeProvider } from "@mui/material";

// Lazy loading componentes
const Bienvenida = lazy(() => import("./animacion/Bienvenida"));
const Sidebar = lazy(() => import("./components/Sidebar"));

// Cache de componentes lazy
const tablaCache = new Map();

// Función optimizada para lazy loading dinámico de tablas
const getLazyTabla = (tablaName) => {
    if (tablaCache.has(tablaName)) {
        return tablaCache.get(tablaName);
    }

    let component;
    switch (tablaName) {
        case "RECEPCIÓN":
            component = lazy(() => import("./components/TablaRecepcion"));
            break;
        case "RECEPCION NISIRA":
            component = lazy(() => import("./components/TablaRecepcionNisira"));
            break;
        case "RESUMEN RECEPCION ":
            component = lazy(() => import("./components/TablaRecepcionResumen"));
            break;
        case "CALIDAD":
            component = lazy(() => import("./components/TablaCalidad"));
            break;
        case "VOLCADO-MUESTRA":
            component = lazy(() => import("./components/TablaVolcadoMuestra"));
            break;
        case "GASIFICADO PRE FRÍO":
            component = lazy(() => import("./components/TablaGasificado"));
            break;
        case "PUCHOS PT":
            component = lazy(() => import("./components/TablaPuchosPT"));
            break;
        case "VOLCADO/ESPERA":
            component = lazy(() => import("./components/TablaEspera"));
            break;
        case "VOLCADO/LÍNEA":
            component = lazy(() => import("./components/TablaLineaVolcado"));
            break;
        case "FRIO":
            component = lazy(() => import("./components/TablaFrio"));
            break;
        case "ORDEN PRD":
            component = lazy(() => import("./components/TablaOrdenes"));
            break;
        default:
            return null;
    }

    tablaCache.set(tablaName, component);
    return component;
};

const endpointMap = { Arandano: { RECEPCIÓN: "recepcion" } };

// Componente memoizado para el fallback de carga (skeleton simple)
const LoadingFallback = memo(() => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-full max-w-3xl px-6">
            <div className="flex gap-4">
            </div>
        </div>
    </div>
));
LoadingFallback.displayName = "LoadingFallback";

const TableLoadingFallback = memo(() => (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <span className="text-sm text-gray-500">Cargando información...</span>
    </div>
));
TableLoadingFallback.displayName = "TableLoadingFallback";

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
    const [selectedOption] = useState("Arandano");
    const [selectedButton, setSelectedButton] = useState("RECEPCIÓN");
    const [data, setData] = useState([]);
    const [, setUltimaActualizacion] = useState(null);
    const intervaloRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [packingExpanded, setPackingExpanded] = useState(true);
    const [expandedVolcado, setExpandedVolcado] = useState(false);

    // Theme memoizado
    const theme = useMemo(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        return createTheme({
            palette: {
                mode: isDarkMode ? "dark" : "light",
            },
        });
    }, []);

    // Secciones memoizadas
    const packingSections = useMemo(
        () => [
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
        ],
        [],
    );

    useEffect(() => {
        const section = getRouteSection(location.pathname);
        if (section && section !== selectedButton) {
            setSelectedButton(section);
        }
    }, [location.pathname, selectedButton]);

    const handleStart = useCallback(() => {
        setMostrarBienvenida(false);
        navigate(ROUTES.RECEPCION);
    }, [navigate]);

    const cargarDatos = useCallback(async () => {
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
    }, [selectedButton, selectedOption]);

    useEffect(() => {
        const intervaloId = setInterval(cargarDatos, 8000);
        intervaloRef.current = intervaloId;
        cargarDatos();
        return () => clearInterval(intervaloId);
    }, [cargarDatos]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) cargarDatos();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [cargarDatos]);

    const ComponenteTabla = useMemo(
        () => getLazyTabla(selectedButton),
        [selectedButton],
    );

    const renderTablas = useCallback(() => {
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
                    </div>
                </div>
            );
        }

        return (
            <Suspense fallback={<TableLoadingFallback />}>
                <ComponenteTabla data={data} />
            </Suspense>
        );
    }, [ComponenteTabla, data]);

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<LoadingFallback />}>
                {
                    mostrarBienvenida && location.pathname === ROUTES.HOME ? (
                        <Bienvenida onStart={handleStart} />
                    ) : (
                        <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
                            {/* Sidebar */}
                            <Suspense fallback={<LoadingFallback />}>
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

                            {/* Contenido principal */}
                            <div className="flex-1 flex flex-col overflow-hidden relative">
                                <Routes>
                                    <Route
                                        path={ROUTES.HOME}
                                        element={<Navigate to={ROUTES.RECEPCION} replace />}
                                    />
                                    <Route
                                        path={ROUTES.RECEPCION}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.RECEPCION_NISIRA}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.RESUMEN_RECEPCION}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.GASIFICADO}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.PUCHOS_PT}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.CALIDAD}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.VOLCADO_MUESTRA}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.VOLCADO_ESPERA}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.VOLCADO_LINEA}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.FRIO}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                    <Route
                                        path={ROUTES.ORDEN_PRD}
                                        element={
                                            <main className="flex-1 overflow-y-auto p-2">
                                                {renderTablas()}
                                            </main>
                                        }
                                    />
                                </Routes>
                            </div>
                        </div>
                    )}
            </Suspense>
        </ThemeProvider>
    );
};

export default App;
