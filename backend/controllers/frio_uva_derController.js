const sql = require("mssql");

const getFrioUvaDer = async (req, res) => {
  // Cambiado a getFrioUvaDer
  try {
    const pool = await sql.connect(process.env.DB_CONFIG);
    const result = await pool.request().query("SELECT * FROM frio_uva_der");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error obteniendo datos de frío:", error);
    res.status(500).json({ error: "Error obteniendo los datos de frío" });
  }
};

//agregar una nueva orden de frio uva der
const addOrden = async (req, res) => {
  const { Palet, Enfriando, TOTAL } = req.body;
  try {
    await sql.query`
      INSERT INTO frio_uva_der (Palet, Enfriando, TOTAL)
      VALUES (${Palet}, ${Enfriando}, ${TOTAL})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getFrioUvaDer, addOrden }; // Exportando el nombre correcto
