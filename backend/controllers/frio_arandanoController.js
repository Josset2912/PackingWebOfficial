const sql = require("mssql");

const getFrioArandano = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONFIG);
    const result = await pool.request().query("SELECT * FROM frio_arandano"); // Ajusta la consulta según tu base de datos

    res.json(result.recordset);
  } catch (error) {
    console.error("Error obteniendo datos de frío:", error);
    res.status(500).json({ error: "Error obteniendo los datos de frío" });
  }
};

//AGREGAR UNA ORDEN
const addOrden = async (req, res) => {
  const { Palet, Enfriando, TOTAL } = req.body; // Desestructurando el cuerpo de la solicitud
  try {
    await sql.query`
            INSERT INTO frio_arandano (Palet, Enfriando, TOTAL)
            VALUES (${Palet}, ${Enfriando}, ${TOTAL})`;
    res.status(201).json({ message: "Orden agregada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error insertando datos" });
  }
};

module.exports = { getFrioArandano, addOrden }; // ✅ Exportando correctamente
