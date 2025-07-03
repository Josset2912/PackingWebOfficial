const { sql } = require("../db");

const getEnfriandoBatch = async (req, res) => {
  const { Cod = "", Sede = "", Cultivo = "" } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)
    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Sede", sql.VarChar, Sede)
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(`exec SP_MOSTRAR_PACKING_ENFRIANDO_BATCH_TV @Cod,@Sede,@Cultivo`); // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre_aran:", error);
    res
      .status(500)
      .json({ error: "Error al obtener datos de gasificado_pre_aran" });
  }
};

module.exports = { getEnfriandoBatch };