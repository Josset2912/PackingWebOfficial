import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Bienvenida from "./components/Bienvenida";
import Header from "./components/Header";
import fetchData from "./utils/api"; // Importar función de API
// Importar componentes de tablas

// Componentes para Arándano
import TablaRecepcionArandano from "./components/TablaRecepcionArandano";
import TablaGasificadoArandano from "./components/TablaGasificadoArandano";
import TablaEsperaArandano from "./components/TablaEsperaArandano";
import TablaLineaVolcadoArandano from "./components/TablaLineaVolcadoArandano";
import TablaFrioArandano from "./components/TablaFrioArandano";
import TablaOrdenesArandano from "./components/TablaOrdenesArandano";
import TablaRecepcionNisiraArandano from "./components/TablaRecepcionNisiraArandano";
