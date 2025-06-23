const sql = require("mssql");

const getFrioData = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONFIG);
    const result = await pool.request().query("SELECT * FROM Frio"); // Ajusta la consulta según tu base de datos

    res.json(result.recordset);
  } catch (error) {
    console.error("Error obteniendo datos de frío:", error);
    res.status(500).json({ error: "Error obteniendo los datos de frío" });
  }
};

//agregar un nuevo registro de frío
const addOrden = async (req, res) => {
  const { PALET, ESPERA } = req.body;
  try {
    await sql.query`
            INSERT INTO Frio (PALET, ESPERA)
            VALUES (${PALET}, ${ESPERA})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getFrioData, addOrden }; // ✅ Exportando correctamente
