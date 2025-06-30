// gasificadoPreController.js
const { sql } = require("../db");

const getGasificadoBatchPre = async (req, res) => {
  const { Cod = "", Turno = "", Cultivo = "" } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)
    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Turno", sql.VarChar, Turno)
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(
        `exec SP_MOSTRAR_PACKING_GASIFICADO_BATCH_TV @Cod,@Turno,@Cultivo`
      );
    // Ajusta la consulta si es necesario
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error obteniendo datos de gasificado_pre:", error);
    res.status(500).json({ error: "Error al obtener datos de gasificado_pre" });
  }
};

module.exports = { getGasificadoBatchPre };
