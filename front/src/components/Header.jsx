import React, { useState, useEffect } from "react";

const Header = ({ logoSrc }) => {
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
        px-4 sm:px-6 py-3 sm:py-1 shadow-[0_4px_20px_rgba(34,211,238,0.1)]
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

      {/* Selector a la derecha */}
    </header>
  );
};

export default Header;
