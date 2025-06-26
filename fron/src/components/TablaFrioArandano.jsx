import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaFrioArandano = () => {
    // Estados para ambas tablas
    const [dataGasificado, setDataGasificado] = useState([]);
    const [dataFrio, setDataFrio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Llamadas paralelas a ambas APIs
                const [resGasificado, resFrio] = await Promise.all([
                    /* axios.get("http://10.51.51.15:8650/api/esperaFrioAran"), //ESPERA FRIO ARANDANO
                    axios.get("http://10.51.51.15:8650/api/enfriandoAran"), //ENFRIANDO ARANDANO */
                    axios.get("http://10.250.200.9:8650/api/esperaFrioAran"), //ESPERA FRIO ARANDANO
                    axios.get("http://10.250.200.9:8650/api/enfriandoAran"), //ENFRIANDO ARANDANO */
                ]);

                setDataGasificado(resGasificado.data);
                setDataFrio(resFrio.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                // No mostramos el error al usuario, solo en consola
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Cálculos para cada tabla
    const cantidadGasificado = dataGasificado.filter(
        (row) => row.ESPERA > 0
    ).length;
    const cantidadFrio = dataFrio.filter((row) => row.Enfriando > 0).length;

    if (loading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tabla Gasificado */}
                <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                    <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                        ESPERA FRIO ARANDANO ({cantidadGasificado})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg md:text-xl">
                                    <th className="px-6 py-4 text-center">PALET</th>
                                    <th className="px-6 py-4 text-center">ESPERA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataGasificado.length > 0 ? (
                                    dataGasificado.map((row, index) => (
                                        <tr
                                            key={`gasificado-${index}`}
                                            className="border-b border-gray-300 hover:bg-indigo-100 transition duration-200 text-lg md:text-xl"
                                        >
                                            <td className="px-6 py-4 text-center text-gray-800">
                                                {row.PALET || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {row.ESPERA ?? "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Ningún dato disponible
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabla Frío */}
                <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                    <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                        ENFRIANDO ARANDANO ({cantidadFrio})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg md:text-xl">
                                    <th className="px-6 py-4 text-center">PALET</th>
                                    <th className="px-6 py-4 text-center">ENFRIANDO</th>
                                    <th className="px-6 py-4 text-center">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFrio.length > 0 ? (
                                    dataFrio.map((row, index) => (
                                        <tr
                                            key={`frio-${index}`}
                                            className="border-b border-gray-300 hover:bg-teal-100 transition duration-200 text-lg md:text-xl"
                                        >
                                            <td className="px-6 py-4 text-center text-gray-800">
                                                {row.PAELT || row.Palet || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {row.ENFRIANDO ?? row.Espera ?? "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-900">
                                                {row.TOTAL ?? "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Ningún dato disponible
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaFrioArandano;
