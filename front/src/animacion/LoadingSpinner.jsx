import React from "react";

const LoadingSpinner = ({ height = "200px", message = "Cargando..." }) => {
  return (
    <div
      className="flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl"
      style={{ height }}
    >
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
