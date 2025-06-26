const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getEspera = async (req, res) => {
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_ESPERA_TV '','','ARANDANO'`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getEspera };
