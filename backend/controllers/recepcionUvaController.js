const sql = require("mssql");

const getRecepcionUva = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM recepcion_uva`;

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo datos de recepción" });
  }
};

module.exports = { getRecepcionUva };
