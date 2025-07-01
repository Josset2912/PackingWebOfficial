const { sql } = require("../db");

const getOrdenesara = async (req, res) => {
    const { Cod = "", Turno = "", Cultivo = "" } = req.query;

  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Turno", sql.VarChar, Turno)
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(`exec SP_MOSTRAR_PACKING_ORDENESPRD_TV @Cod,@Turno,@Cultivo`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
    }
    
};

module.exports = { getOrdenesara };
