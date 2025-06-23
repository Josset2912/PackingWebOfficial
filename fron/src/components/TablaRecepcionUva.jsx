const TablaRecepcionUva = ({ data }) => {
  return (
    <div className="flex justify-center mt-6 px-4">
      {/* Contenedor con scroll horizontal y sombras */}
      <div className="w-full max-w-2xl overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="min-w-full bg-white rounded-lg">
          {/* Cabecera de la tabla */}
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide ">
                VAR
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">
                EJECUCIÓN
              </th>
            </tr>
          </thead>
          {/* Cuerpo de la tabla */}
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                  {row.VAR}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
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

export default TablaRecepcionUva;
