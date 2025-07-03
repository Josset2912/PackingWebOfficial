const { sql } = require("../db"); // AJUSTA la ruta según tu proyecto

const getRecepcionNisira = async (req, res) => {
  const { Cod = "", Sede = "", Cultivo = "", Id = "" } = req.query;
  try {
    const pool = await sql.connect(); // Obtiene el pool conectado (ya está conectado por connectDB)

    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Sede", sql.VarChar, Sede)
      .input("Cultivo", sql.VarChar, Cultivo)
      .input("Id", sql.Int, Id)
      .query(
        `exec SP_MOSTRAR_PACKING_RECEPCION_NISIRA_TV @Cod,@Sede,@Cultivo,@Id`
      );

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getRecepcionNisira };
