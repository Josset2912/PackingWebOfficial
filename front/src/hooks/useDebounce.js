import { useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para debounce
 * @param {Function} callback - Función a ejecutar después del delay
 * @param {number} delay - Tiempo de espera en milisegundos
 * @param {Array} dependencies - Array de dependencias
 */
export const useDebounce = (callback, delay, dependencies) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, delay]);
};

/**
 * Hook para valor debouncado
 * @param {any} value - Valor a debounce
 * @param {number} delay - Tiempo de espera en milisegundos
 * @returns {any} Valor debouncado
 */
export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
