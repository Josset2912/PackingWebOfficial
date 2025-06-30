const { sql } = require("../db");

const getOrdenesara = async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_ORDENESPRD_TV '','','ARANDANO'`);

    if (!result.recordset || result.recordset.length === 0) {
      console.warn("⚠ SP no devolvió datos");
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error en /api/ordenes:", err);
    res.status(500).json({
      error: "Error obteniendo datos de órdenes",
      detalle: err.message,
    });
  }
};

module.exports = { getOrdenesara };
