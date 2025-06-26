import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Bienvenida from "./components/Bienvenida";
import Header from "./components/Header";
import BotonSeccion from "./components/BotonSeccion";
import { fetchData } from "./utils/api";

// Componentes para Arándano
import TablaRecepcionArandano from "./components/TablaRecepcionArandano";
import TablaGasificadoArandano from "./components/TablaGasificadoArandano";
import TablaEsperaArandano from "./components/TablaEsperaArandano";
import TablaFrioArandano from "./components/TablaFrioArandano";
import TablaOrdenesArandano from "./components/TablaOrdenesArandano";

// Componentes para Uva
//import TablaRecepcionUva from "./components/TablaRecepcionUva";
//import TablaGasificadoUva from "./components/TablaGasificadoUva";
//import TablaEsperaUva from "./components/TablaEsperaUva";
//import TablaFrioUva from "./components/TablaFrioUva";
//import TablaOrdenesUva from "./components/TablaOrdenesUva";

// Mapeo de endpoints
const endpointMap = {
  Arandano: {
    RECEPCIÓN: "recepcionAran",
    "GASIFICADO PRE FRÍO": "gasificadoPreFrioAran",
    ESPERA: "esperaVolcadoAran",
    FRIO: "esperaFrioAran",
    "ORDEN PRD": "ordenesPTAran",
  },
  /*Uva: {
    RECEPCIÓN: "recepcion_uva",
    "GASIFICADO-VOLCADO": "gasificado_uva",
    ESPERA: "espera_uva",
    FRIO: "frio_uva",
    "ORDEN PRD": "ordenes_uva",
  },*/
};

// Mapeo de componentes de tabla
const tablaMap = {
  Arandano: {
    RECEPCIÓN: TablaRecepcionArandano,
    "GASIFICADO PRE FRÍO": TablaGasificadoArandano,
    ESPERA: TablaEsperaArandano,
    FRIO: TablaFrioArandano,
    "ORDEN PRD": TablaOrdenesArandano,
  },
  /*Uva: {
    RECEPCIÓN: TablaRecepcionUva,
    GASIFICADO: TablaGasificadoUva,
    //ESPERA: TablaEsperaUva,
    //FRIO: TablaFrioUva,
    //"ORDEN PRD": TablaOrdenesUva,
  },
  */
};

const App = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Arandano"); // Cambiado a valor por defecto
  const [selectedButton, setSelectedButton] = useState("RECEPCIÓN"); // Cambiado a valor por defecto
  const [cargando, setCargando] = useState(false);
  const [data, setData] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const intervaloRef = useRef(null);

  const handleStart = () => {
    setMostrarBienvenida(false);
    // Los valores ya están establecidos por defecto
  };

  // Función para cargar datos
  const cargarDatos = async () => {
    if (!selectedButton || !selectedOption) return;

    const endpoint = endpointMap[selectedOption]?.[selectedButton];
    if (!endpoint) return;

    setCargando(true);
    try {
      const response = await fetchData(endpoint);
      setData(response);
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error(`Error cargando datos de ${endpoint}:`, error);
      setData([]);
    } finally {
      setCargando(false);
    }
  };

  // Configurar intervalo de actualización
  useEffect(() => {
    // Limpiar intervalo anterior
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }

    // Cargar datos inmediatamente
    cargarDatos();

    // Establecer nuevo intervalo
    intervaloRef.current = setInterval(() => {
      cargarDatos();
    }, 10000); // Actualizar cada 10 segundos

    // Limpieza al desmontar o cambiar de vista
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [selectedOption, selectedButton]);

  // Actualizar al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cargarDatos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedOption, selectedButton]);

  const renderMensajeBienvenida = () => {
    if (mostrarBienvenida) {
      return <Bienvenida onStart={handleStart} />;
    }
    return null; // Eliminado el mensaje intermedio
  };

  const renderTablas = () => {
    const ComponenteTabla = tablaMap[selectedOption]?.[selectedButton];
    return ComponenteTabla ? (
      <>
        {/* Mensaje de actualización */}
        {/*  */}

        <ComponenteTabla data={data} />
      </>
    ) : null;
  };
  return (
    <>
      <Header
        logoSrc="/santa.png"
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setSelectedButton={setSelectedButton}
      />
      {renderMensajeBienvenida()}
      <BotonSeccion
        selectedOption={selectedOption}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      {renderTablas()}
    </>
  );
};

export default App;
