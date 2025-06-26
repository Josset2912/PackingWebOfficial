const { sql } = require("../db");

const getOrdenesara = async (req, res) => {
  try {
    console.log("📌 Recibida petición /api/ordenes");

    const pool = await sql.connect();
    console.log("📌 Conectado a SQL Server");

    const result = await pool
      .request()
      .query(`exec SP_MOSTRAR_PACKING_ORDENESPRD_TV '','','ARANDANO'`);

    console.log("✅ Resultado SP:", result);

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
