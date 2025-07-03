const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getSede = async (req, res) => {
  const { Emp = "" } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .input("Emp", sql.VarChar, Emp)

      .query(`exec SP_MOSTRAR_SEDE_PANELES @Emp`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getSede };
