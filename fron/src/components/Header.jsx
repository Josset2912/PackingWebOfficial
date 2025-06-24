import React, { useState, useEffect } from "react";

/**
 * Componente Header
 * Renderiza el encabezado de la aplicación con:
 * - Logo (clicable que redirige al inicio)
 * - Hora actual centrada en formato 24 hrs (actualizada cada segundo)
 * - Selector de opciones (Arándano / Uva)
 */
const Header = ({
  logoSrc, // Ruta de la imagen del logo
  selectedOption, // Valor actual seleccionado en el selector
  setSelectedOption, // Función para actualizar el valor seleccionado
  setSelectedButton, // Función para resetear el botón seleccionado (opcional)
}) => {
  // Estado local para la hora actual (24 hrs)
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className="
        flex flex-col sm:flex-row items-center justify-between
        bg-gray-900 border-b border-cyan-400/20 text-cyan-100
        px-4 sm:px-6 py-3 sm:py-4 shadow-[0_4px_20px_rgba(34,211,238,0.1)]
        w-full gap-3 sm:gap-0
      "
    >
      {/* Logo a la izquierda */}
      <a
        href="/"
        className="flex items-center gap-2 group order-1 sm:order-none"
      >
        <img
          src={logoSrc}
          alt="Logo"
          className="
            h-8 sm:h-10
            group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]
            transition-all duration-300
          "
        />
      </a>

      {/* Hora centrada */}
      <div
        className="
          text-white text-lg sm:text-xl font-semibold tracking-wider 
          px-3 py-1 sm:px-4 sm:py-2 
          rounded-lg 
          font-sans
          order-3 sm:order-none w-full sm:w-auto text-center
        "
      >
        ACTUALIZADO: {currentTime}
      </div>

      {/* Selector a la derecha */}
      <select
        className="
          bg-gray-800 text-cyan-100 py-2 px-3 sm:px-4 rounded-lg
          border border-cyan-400/60
          hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300
          transition-all duration-300
          text-sm w-full sm:w-36 md:w-56
          shadow-[0_0_15px_rgba(34,211,238,0.15)]
          order-2 sm:order-none
        "
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
          setSelectedButton && setSelectedButton(null);
        }}
      >
        <option value="">Seleccionar opción</option>
        <option value="Arándano">Arándano</option>
        <option value="Uva">Uva</option>
      </select>
    </header>
  );
};

export default Header;
