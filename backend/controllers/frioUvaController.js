const sql = require("mssql");

const getFrioUva = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONFIG);
    const result = await pool.request().query("SELECT * FROM frio_uva"); // Ajusta la consulta según tu base de datos

    res.json(result.recordset);
  } catch (error) {
    console.error("Error obteniendo datos de frío:", error);
    res.status(500).json({ error: "Error obteniendo los datos de frío" });
  }
};

module.exports = { getFrioUva }; // ✅ Exportando correctamente
