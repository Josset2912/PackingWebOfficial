const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getMaquina = async (req, res) => {
  const { Cultivo = "" } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(`exec  SP_LISTAR_MAQUINA_CULTIVO_PACKING @Cultivo`);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getMaquina };
