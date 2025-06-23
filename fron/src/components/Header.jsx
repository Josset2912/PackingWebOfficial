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
        flex items-center justify-between
        bg-gray-900 border-b border-cyan-400/20 text-cyan-100
        px-6 py-4 shadow-[0_4px_20px_rgba(34,211,238,0.1)]
        relative
      "
    >
      {/* Logo a la izquierda */}
      <a href="/" className="flex items-center gap-2 group">
        <img
          src={logoSrc}
          alt="Logo"
          className="
            h-10 sm:h-8
            group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]
            transition-all duration-300
          "
        />
      </a>

      {/* Hora centrada con posición absoluta */}
      <div
        className="
          absolute left-1/2 transform -translate-x-1/2
          text-white text-xl font-semibold tracking-wider 
          px-4 py-2 
          rounded-lg 
          font-sans
        "
      >
        ACTUALIZADO:
        {currentTime}
      </div>

      {/* Selector a la derecha */}
      <select
        className="
          bg-gray-800 text-cyan-100 py-2 px-4 rounded-lg
          border border-cyan-400/60
          hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300
          transition-all duration-300
          text-sm w-36 sm:w-56
          shadow-[0_0_15px_rgba(34,211,238,0.15)]
        "
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
          setSelectedButton(null);
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
