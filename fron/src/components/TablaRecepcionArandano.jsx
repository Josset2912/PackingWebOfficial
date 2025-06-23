const TablaRecepcionArandano = ({ data }) => {
  // Declara un componente funcional que recibe un prop llamado 'data' (arreglo de datos)
  return (
    <div className="flex justify-center mt-6 px-4">
      {/* Contenedor padre con flexbox que centra su contenido horizontalmente, con margen superior y padding horizontal */}

      <div className="w-full max-w-2xl overflow-x-auto shadow-md rounded-lg border border-gray-300">
        {/* Contenedor de la tabla que: 
              - ocupa todo el ancho disponible ('w-full')
              - tiene un ancho máximo de 2xl (max-w-2xl, que es 42rem aprox)
              - permite scroll horizontal si el contenido es muy ancho ('overflow-x-auto')
              - tiene sombra, bordes redondeados y borde gris */}

        <table className="min-w-full bg-white rounded-lg">
          {/* Tabla que tiene como mínimo el 100% del ancho del contenedor, fondo blanco y bordes redondeados */}

          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              {/* Fila del encabezado con fondo degradado azul y texto blanco */}

              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide ">
                {/* Celda de encabezado con padding, texto centrado, tamaño pequeño, negrita, mayúsculas y espacio entre letras */}
                VAR
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">
                EJECUCIÓN
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* Cuerpo de la tabla que añade una línea divisoria gris entre filas */}

            {data.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
                /* Cada fila alterna el color de fondo (gris claro y blanco) para mejorar la legibilidad.
                     Además, al pasar el mouse cambia el color de fondo con una transición suave */
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                  {/* Celda con padding, texto mediano, color gris oscuro y texto centrado */}
                  {row.VAR}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {/* Celda con padding, texto pequeño, color gris más claro y centrado */}
                  {row.EJEC}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaRecepcionArandano; // Exporta el componente para usarlo en otras partes
