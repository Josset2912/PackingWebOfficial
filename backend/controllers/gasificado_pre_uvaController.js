// controllers/gasificadoPreAranController.js
const { sql } = require("../db");

const getGasificadoPreUva = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM gasificado_pre_uva");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error en gasificado_pre_uva:", error);
    res.status(500).json({
      error: "Error al obtener datos de gasificado arándano",
      details: error.message,
    });
  }
};

//AGREGAR UNA NUEVA ORDEN DE GASIFICADO PRE UVA
const addOrden = async (req, res) => {
  const { Palet, Espera, TOTAL } = req.body;
  try {
    await sql.query`
      INSERT INTO gasificado_pre_uva (Prioridad, Destino, Presentacion, Ejec_proy, F_despacho)
      VALUES (${Palet}, ${Espera}, ${TOTAL})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getGasificadoPreUva,addOrden };
