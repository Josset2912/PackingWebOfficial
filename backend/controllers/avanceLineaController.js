const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getAvanceLinea = async (req, res) => {
  const {
    Fecha = "",
    Sede = "",
    Cultivo = "",
    Turno = "",
    Maquina = "",
    Id = "",
  } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .input("Fecha", sql.VarChar, Fecha)
      .input("Sede", sql.VarChar, Sede)
      .input("Cultivo", sql.VarChar, Cultivo)
      .input("Turno", sql.VarChar, Turno)
      .input("Maquina", sql.VarChar, Maquina)
      .input("Id", sql.Int, Id)
      .query(
        `exec SP_MOSTRAR_PROYEC_EJEC_VOLCADO @Fecha,@Sede,@Cultivo,@Turno,@Maquina,@Id`
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getAvanceLinea };
