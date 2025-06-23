// controllers/gasificadoPreAranController.js
const { sql } = require("../db");

const getGasificadoPreAran = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM gasificado_pre_aran");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en gasificado_pre_aran:", error);
    res.status(500).json({
      error: "Error al obtener datos de gasificado arándano",
      details: error.message,
    });
  }
};
//AGREGAR UNA ORDEN
const addOrden = async (req, res) => {
  const { Palet, Espera, TOTAL } = req.body; // Desestructurando el cuerpo de la solicitud
  try {
    await sql.query`
                INSERT INTO gasificado_pre_aran (Palet, Espera, TOTAL)
                VALUES (${Palet}, ${Espera}, ${TOTAL})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getGasificadoPreAran,addOrden };
