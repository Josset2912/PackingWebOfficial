const { sql } = require("../db");

const getEsperaUva = async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM espera_uva"); // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de espera:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
};

module.exports = { getEsperaUva };
