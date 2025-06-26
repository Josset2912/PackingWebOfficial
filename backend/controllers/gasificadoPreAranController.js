// gasificadoPreController.js
const { sql } = require("../db");

const getGasificadoPre = async (req, res) => {
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)
    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_GASIFICADO_ESPERA_TV '','','ARANDANO'`);
    // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre:", error);
    res.status(500).json({ error: "Error al obtener datos de gasificado_pre" });
  }
};

module.exports = { getGasificadoPre };
