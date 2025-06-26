import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaGasificadoArandano = () => {
    // Estados para ambas tablas
    const [dataGasificado, setDataGasificado] = useState([]);
    const [dataGasificadoBatch, setDataGasificadoBatch] = useState([]);
    const [dataFrio, setDataFrio] = useState([]);
    const [dataFrioBatch, setDataFrioBatch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Llamadas paralelas a ambas APIs
                const [resGasificado, resFrio, resGasificadoBatch, resFrioBatch] =
                    await Promise.all([
                        /*  axios.get("http://10.51.51.15:8650/api/gasificadoPreAran"),
                         axios.get("http://10.51.51.15:8650/api/gasificadoPreFrioAran"),
                         axios.get("http://10.51.51.15:8650/api/gasificadoBatchPreAran"),
                         axios.get("http://10.51.51.15:8650/api/gasificadoBatchPreFrioAran"), */

                        axios.get("http://10.250.200.9:8650/api/gasificadoPreAran"),
                        axios.get("http://10.250.200.9:8650/api/gasificadoPreFrioAran"),
                        axios.get("http://10.250.200.9:8650/api/gasificadoBatchPreAran"),
                        axios.get("http://10.250.200.9:8650/api/gasificadoBatchPreFrioAran"),
                    ]);

                setDataGasificado(resGasificado.data || []);
                setDataFrio(resFrio.data || []);
                setDataGasificadoBatch(resGasificadoBatch.data || []);
                setDataFrioBatch(resFrioBatch.data || []);
            } catch (err) {
                console.error("Error en la carga (silenciado):", err);
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
    const cantidadFrio = dataFrio.filter((row) => row.ESPERA > 0).length;

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
                <div>
                    {/* Tabla Gasificado #1 */}
                    <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                        <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                            ESPERA GASIFICADO ARÁNDANO ({cantidadGasificado})
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
                                    {error ? (
                                        <tr>
                                            <td
                                                colSpan="2"
                                                className="px-6 py-4 text-center text-red-500"
                                            >
                                                Error: {error}
                                            </td>
                                        </tr>
                                    ) : dataGasificado.length > 0 ? (
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
                                                No hay datos disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabla Gasificado 21 */}
                    <div className="mt-8">
                        <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                            <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                                BATCH GASIFICADO
                                {/* ({cantidadGasificado}) */}
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg md:text-xl">
                                            <th className="px-6 py-4 text-center">BATCH</th>
                                            <th className="px-6 py-4 text-center">PALETS</th>
                                            <th className="px-6 py-4 text-center">TIME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {error ? (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="px-6 py-4 text-center text-red-500"
                                                >
                                                    Error: {error}
                                                </td>
                                            </tr>
                                        ) : dataGasificadoBatch.length > 0 ? (
                                            dataGasificadoBatch.map((row, index) => (
                                                <tr
                                                    key={`gasificado-${index}`}
                                                    className="border-b border-gray-300 hover:bg-indigo-100 transition duration-200 text-lg md:text-xl"
                                                >
                                                    <td className="px-6 py-4 text-center text-gray-800">
                                                        {row.BATCH || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-700">
                                                        {row.PALETS ?? "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-700">
                                                        {row.TIME ?? "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No hay datos disponibles
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Espacio entre tablas */}
                </div>

                <div className="">
                    {/* Tabla Frío */}
                    <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                        <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                            ESPERA PRE FRÍO ARÁNDANO ({cantidadFrio})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg md:text-xl">
                                        <th className="px-6 py-4 text-center">PALET</th>
                                        <th className="px-6 py-4 text-center">ESPERA</th>
                                        <th className="px-6 py-4 text-center">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-4 text-center text-red-500"
                                            >
                                                Error: {error}
                                            </td>
                                        </tr>
                                    ) : dataFrio.length > 0 ? (
                                        dataFrio.map((row, index) => (
                                            <tr
                                                key={`frio-${index}`}
                                                className="border-b border-gray-300 hover:bg-teal-100 transition duration-200 text-lg md:text-xl"
                                            >
                                                <td className="px-6 py-4 text-center text-gray-800">
                                                    {row.PALET || row.PALET || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-700">
                                                    {row.ESPERA ?? row.ESPERA ?? "N/A"}
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
                                                No hay datos disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <div className="mt-8">
                            {/* Tabla Frío */}
                            <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
                                <h2 className="mb-4 text-center font-bold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
                                    BATCH PRE FRIO
                                    {/*({cantidadFrio})*/}
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg md:text-xl">
                                                <th className="px-6 py-4 text-center">BATCH</th>
                                                <th className="px-6 py-4 text-center">PALETS</th>
                                                <th className="px-6 py-4 text-center">TIME</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {error ? (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-4 text-center text-red-500"
                                                    >
                                                        Error: {error}
                                                    </td>
                                                </tr>
                                            ) : dataFrioBatch.length > 0 ? (
                                                dataFrioBatch.map((row, index) => (
                                                    <tr
                                                        key={`frio-${index}`}
                                                        className="border-b border-gray-300 hover:bg-teal-100 transition duration-200 text-lg md:text-xl"
                                                    >
                                                        <td className="px-6 py-4 text-center text-gray-800">
                                                            {row.BATCH || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-gray-700">
                                                            {row.PALETS ?? "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-gray-900">
                                                            {row.TIME ?? "N/A"}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-6 py-4 text-center text-gray-500"
                                                    >
                                                        No hay datos disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaGasificadoArandano;
