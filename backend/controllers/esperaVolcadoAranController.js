const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getEspera = async (req, res) => {
  const { Cod = "", Turno = "", Cultivo = "" } = req.query;

  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Turno", sql.VarChar, Turno)
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(`exec SP_MOSTRAR_PACKING_ESPERA_TV @Cod,@Turno,@Cultivo`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getEspera };
