const TablaEsperaUva = ({ data }) => {
  // Contar cuántos elementos tienen un valor en la columna ESPERA
  const cantidadEnEspera = data.filter((row) => row.ESPERA > 0).length;

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
        <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
          ESPERA VOLCADO ARÁNDANO {cantidadEnEspera}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg md:text-xl">
                <th className="px-6 py-4 text-center">PALET</th>
                <th className="px-6 py-4 text-center">ESPERA</th>
                <th className="px-6 py-4 text-center">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 hover:bg-cyan-100 transition duration-200 text-lg md:text-xl"
                >
                  <td className="px-6 py-4 text-center text-gray-800">
                    {row.PALET}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {row.ESPERA}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">
                    {row.TOTAL}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaEsperaUva;
