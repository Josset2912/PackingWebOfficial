const { sql } = require("../db");

const getOrdenesara = async (req, res) => {
    const { Cod = "", Sede = "", Cultivo = "" } = req.query;

  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Cod", sql.VarChar, Cod)
      .input("Sede", sql.VarChar, Sede)
      .input("Cultivo", sql.VarChar, Cultivo)
      .query(`exec SP_MOSTRAR_PACKING_ORDENESPRD_TV @Cod,@Sede,@Cultivo`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener datos de recepción:", err);
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
    }
    
};

module.exports = { getOrdenesara };
